import { getErrorFromResponse, pruneNullableValuesFromObject } from './fetch-helpers';
const global = typeof window === 'undefined' ? globalThis : window;
const fetch = global.fetch ?? require('node-fetch');

export type GetGtfsrtdatafeedParams = {
  boundingBox?: number[];
  routeId?: string[];
  startTimeAfter?: number;
  startTimeBefore?: number;
  api_key: string;
};

export type GetDatafeedParams = {
  boundingBox?: number[];
  operatorRef?: string[];
  vehicleRef?: string;
  lineRef?: string;
  producerRef?: string;
  originRef?: string;
  destinationRef?: string;
  api_key: string;
};

export interface VehicleLocation {
  Longitude?: number;
  Latitude?: number;
}

export interface MonitoredVehicleJourney {
  LineRef?: string;
  DirectionRef?: string;
  PublishedLineName?: string;
  OperatorRef?: string;
  OriginRef?: string;
  OriginName?: string;
  DestinationRef?: string;
  DestinationName?: string;
  VehicleLocation?: VehicleLocation;
  Bearing?: number;
  BlockRef?: string;
  VehicleRef?: string;
}

export type VehicleActivityExtensions = { [key: string]: unknown };

export interface VehicleActivity {
  RecordedAtTime?: string;
  ItemIdentifier?: string;
  ValidUntilTime?: string;
  MonitoredVehicleJourney?: MonitoredVehicleJourney;
  Extensions?: VehicleActivityExtensions;
}

export interface VehicleMonitoringDelivery {
  ResponseTimestamp?: string;
  RequestMessageRef?: string;
  ValidUntil?: string;
  ShortestPossibleCycle?: string;
  VehicleActivity?: VehicleActivity;
}

export interface ServiceDelivery {
  ResponseTimestamp?: string;
  ProducerRef?: string;
  VehicleMonitoringDelivery?: VehicleMonitoringDelivery;
}

export interface Siri {
  ServiceDelivery?: ServiceDelivery;
}

const BUS_DATA_URL = 'https://data.bus-data.dft.gov.uk/api/v1';

/**
 * Returns all published datafeeds
 */
export const getDatafeed = async (
  { boundingBox = [], operatorRef = [], ...rest }: GetDatafeedParams,
  options?: RequestInit,
) => {
  const response = await fetch(
    `${BUS_DATA_URL}/datafeed?${new URLSearchParams(
      pruneNullableValuesFromObject({
        ...rest,
        ...(boundingBox.length ? { boundingBox: boundingBox.toString() } : {}),
        ...(operatorRef.length ? { operatorRef: operatorRef.toString() } : {}),
      }),
    )}`,
    {
      ...options,
      method: 'GET',
    },
  );

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json() as Promise<GetDatafeedResult>;
};

/**
 * Returns a single datafeed
 * @summary Find datafeed by ID
 */
export const getDatafeedDatafeedID = async (datafeedID: number, options?: RequestInit) => {
  const response = await fetch(`${BUS_DATA_URL}/datafeed/${datafeedID}`, {
    ...options,
    method: 'GET',
  });

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json() as Promise<GetDatafeedDatafeedIDResult>;
};

/**
 * Returns all published datafeeds
 * @summary Returns all vehicles in GTFS RT format
 */
export const getGtfsrtdatafeed = async (
  { boundingBox = [], ...rest }: GetGtfsrtdatafeedParams,
  options?: RequestInit,
) => {
  const response = await fetch(
    `${BUS_DATA_URL}/gtfsrtdatafeed?${new URLSearchParams(
      pruneNullableValuesFromObject({
        ...rest,
        ...(boundingBox.length ? { boundingBox: boundingBox.toString() } : {}),
      }),
    )}`,
    {
      ...options,
      method: 'GET',
    },
  );

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.arrayBuffer();
};

export type GetDatafeedResult = Siri;
export type GetDatafeedDatafeedIDResult = Siri;
export type GetGtfsrtdatafeedResult = ArrayBuffer;
