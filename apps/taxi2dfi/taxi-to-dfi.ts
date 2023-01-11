import { Stringifier, stringify } from 'csv-stringify';
import { spawn } from 'child_process';
import ora from 'ora';
import { postPointsInsert } from 'dfi-utils';

interface PayloadStruct {
  version?: number;
  taxiColor: string;
  type: 'pickup' | 'dropoff';
  charge: number;
  tip: number;
  tolls: number;
}

const payload = ({
  version = 1,
  taxiColor: [colorChar],
  type: [typeChar],
  charge,
  tip,
  tolls,
}: PayloadStruct) =>
  [
    version,
    (colorChar ?? '').toUpperCase(),
    (typeChar ?? '').toUpperCase(),
    charge,
    tip,
    tolls,
  ].join('|');

const id = (...args: (string | number)[]) => args.join('_');

interface Entry {
  vendor_name: string;
  Trip_Pickup_DateTime: string;
  Trip_Dropoff_DateTime: string;
  Passenger_Count: number;
  Trip_Distance: number;
  Start_Lon: number;
  Start_Lat: number;
  Rate_Code: string | null;
  store_and_forward: null;
  End_Lon: number;
  End_Lat: number;
  Payment_Type: string;
  Fare_Amt: number;
  surcharge: number;
  mta_tax: null;
  Tip_Amt: number;
  Tolls_Amt: number;
  Total_Amt: number;
}

const transformParquetBufferToJSON = (buffer: Buffer) => {
  const stringifiedData = buffer.toString();
  const stringifiedJSONObjects = stringifiedData.split('\n');

  try {
    return stringifiedJSONObjects
      .filter(Boolean)
      .map((stringifiedJSONObject) => JSON.parse(stringifiedJSONObject) as Partial<Entry>)
      .filter(
        ({ Trip_Dropoff_DateTime, Trip_Pickup_DateTime, Start_Lat, Start_Lon, End_Lat, End_Lon }) =>
          !!Trip_Dropoff_DateTime &&
          !!Trip_Pickup_DateTime &&
          !!Start_Lat &&
          !!Start_Lon &&
          !!End_Lat &&
          !!End_Lon,
      ) as Entry[];
  } catch (e) {
    throw new Error(stringifiedData);
  }
};

interface Options {
  apiToken: string;
  instance?: string;
  taxiColor: 'yellow' | 'green';
  points?: number;
  dfiUrl?: string;
}

const writeJSONToCSVStream = (
  {
    vendor_name,
    Trip_Dropoff_DateTime,
    Trip_Pickup_DateTime,
    Start_Lat,
    Start_Lon,
    End_Lat,
    End_Lon,
    Fare_Amt = 0,
    surcharge = 0,
    Tip_Amt = 0,
    Tolls_Amt = 0,
    taxiColor,
  }: Entry & Pick<Options, 'taxiColor'>,
  csvStream: Stringifier,
) => {
  const partialPayload: Omit<PayloadStruct, 'type'> = {
    taxiColor,
    charge: Fare_Amt + surcharge,
    tip: Tip_Amt,
    tolls: Tolls_Amt,
  };

  const pointId = id(vendor_name, Trip_Pickup_DateTime, Math.random());

  csvStream.write(
    [
      pointId,
      Start_Lat,
      Start_Lon,
      undefined,
      Trip_Pickup_DateTime,
      payload({
        ...partialPayload,
        type: 'pickup',
      }),
    ],
    'ascii',
  );

  csvStream.write(
    [
      pointId,
      End_Lat,
      End_Lon,
      undefined,
      Trip_Dropoff_DateTime,
      payload({
        ...partialPayload,
        type: 'dropoff',
      }),
    ],
    'ascii',
  );
};

export const taxiToDfi = async (
  filename: string,
  { taxiColor, instance, apiToken, points, dfiUrl: baseURL }: Options,
) => {
  const spinner = ora('Processing...');

  const csvStream = stringify();

  let done = 0;

  spinner.start();

  const parquet = spawn(`parquet cat ${points ? `-n ${points}` : ''} ${filename}`, {
    shell: true,
  });

  parquet.stdout.on('data', (buffer: Buffer) => {
    const entries = transformParquetBufferToJSON(buffer);

    entries.forEach((entry) => writeJSONToCSVStream({ ...entry, taxiColor }, csvStream));

    if (spinner.isSpinning) {
      done += entries.length;
      spinner.text = `Processed ${done} points`;
    }
  });

  parquet.on('close', () => csvStream.end());
  parquet.on('exit', () => csvStream.end());
  parquet.on('error', (e) => {
    csvStream.end();
    spinner.fail(e.message);
    process.exit(1);
  });

  try {
    await postPointsInsert(
      csvStream as unknown as ReadableStream,
      {
        instance,
      },
      {
        baseURL,
        headers: {
          'X-API-TOKEN': `Bearer ${apiToken}`,
          'Content-Type': 'text/csv',
        },
      },
    );
    spinner.succeed(`Sent ${done} journey${done !== 1 ? 's' : ''} to DFI`);
  } catch (e) {
    spinner.fail(e.error);
    process.exit(1);
  }
};
