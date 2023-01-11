import { getGtfsrtdatafeed, Point, postPointsInsert } from 'dfi-utils';
import GtfsRealtimeBindings, { Entity } from 'gtfs-realtime-bindings';
import ora from 'ora';

const decodeBuffer = (arrayBuffer: ArrayBuffer) =>
  GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(Buffer.from(arrayBuffer));

const cache = new Set();
const filterEntities = (feed: { entity: Entity[] }) =>
  feed.entity.filter(({ id }) => {
    const cacheContainsEntity = cache.has(id);

    if (cacheContainsEntity) return false;

    cache.add(id);

    return true;
  });

const entitiesToPoints = (entities: Entity[]): Point[] =>
  entities.map((entity) => ({
    id: entity.vehicle.vehicle.id,
    time: new Date(Number(entity.vehicle.timestamp) * 1000).toISOString(),
    coordinate: [entity.vehicle.position.longitude, entity.vehicle.position.latitude],
    payload: `1|${entity.vehicle.trip.routeId}`,
  }));

interface Options {
  apiToken: string;
  govApiToken: string;
  instance?: string;
  route?: string[];
  startTimeAfter: number;
  dfiUrl?: string;
}

const start = async ({
  apiToken,
  govApiToken,
  instance,
  route,
  dfiUrl: baseURL,
  ...rest
}: Options) => {
  let { startTimeAfter } = rest;
  const spinner = ora('Waiting for new pings...').start();

  setInterval(async () => {
    try {
      const arrayBuffer = await getGtfsrtdatafeed({
        startTimeAfter,
        routeId: route,
        api_key: govApiToken,
      })
        // Sometimes we get a 50X error, so we just ignore it...
        .catch(() => null);

      const entities = arrayBuffer ? decodeBuffer(arrayBuffer) : { entity: [] };

      const filteredEntities = filterEntities(entities);

      const points = entitiesToPoints(filteredEntities);

      if (points.length) {
        await postPointsInsert(
          points,
          {
            instance,
          },
          {
            baseURL,
            headers: {
              'X-API-TOKEN': `Bearer ${apiToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const last = points.reduce(
          (curr, { time }) =>
            time ? Math.max(Math.round(new Date(time).getTime() / 1000), curr) : curr,
          startTimeAfter,
        );

        startTimeAfter = last;

        spinner.succeed(`Published ${points.length} new ping${points.length === 1 ? '' : 's'}`);
      }
    } catch (e) {
      spinner.fail(typeof e === 'string' ? e : e.error ?? e.message);
    } finally {
      if (!spinner.isSpinning) {
        spinner.start('Waiting for new pings...');
      }
    }
  }, 5000);
};

export const busToDfi = async (_: string, options: Options) => start(options);
