import {
  getErrorFromResponse,
  paramsToParamsWithISOStrings,
  pruneNullableValuesFromObject,
} from './fetch-helpers';

const global = typeof window === 'undefined' ? globalThis : window;
const fetch = global.fetch ?? require('node-fetch');

type RequestOptions = Omit<RequestInit, 'body' | 'method' | 'headers'> & {
  headers: { 'X-API-TOKEN': `Bearer ${string}` } & { [key: string]: string };
  baseURL?: string;
};

export type GetPolygonPointsEntitiesParams = {
  include?: IncludeEntitiesParameter;
  exclude?: ExcludeEntitiesParameter;
  startTime?: StartTimeParameter;
  endTime?: EndTimeParameter;
  instance?: InstanceParameter;
};

export type GetGeofencesParams = {
  before?: CreatedBeforeParameter;
  pageSize?: PageSizeParameter;
};

export type GetHistoryId200PointsItem = {
  coordinate: Coordinate;
  time: Time;
  payload: Payload;
};

export type GetHistoryId200 = {
  instance: string;
  points: GetHistoryId200PointsItem[];
};

export type GetHistoryIdParams = {
  startTime?: StartTimeParameter;
  endTime?: EndTimeParameter;
  instance?: InstanceParameter;
};

export type PostPointsInsert201 = {
  instance: string;
  result: InsertionResult;
};

export type GetVersionParams = { instance?: InstanceParameter };

/**
 * Return only public entities when true, return only user-created entities when false. Default is false if omitted.
 */
export type PublicParameter = boolean;

export type GetPolygonsNameParams = { public?: PublicParameter };

/**
 * Number of items to return in the response. Maximum is 500. Default is 100 if omitted
 */
export type PageSizeParameter = number;

/**
 * Only retrieve items created before this given time. Defaults to now.
 */
export type CreatedBeforeParameter = string;

export type GetPolygonsParams = {
  before?: CreatedBeforeParameter;
  pageSize?: PageSizeParameter;
  public?: PublicParameter;
};

/**
 * Optionally select the instance of the Data Flow Index that the query should be used. If this is not supplied, the current default will be used
 */
export type InstanceParameter = string;

export type PostGeofencesParams = { instance?: InstanceParameter };

export type PostPointsInsertParams = { instance?: InstanceParameter };

/**
 * Only retrieves points before this given time
 */
export type EndTimeParameter = Date;

/**
 * Only retrieves points after this given time
 */
export type StartTimeParameter = Date;

/**
 * A comma separated list of entities to exclude
 */
export type ExcludeEntitiesParameter = string;

/**
 * A comma separated list of entities to include
 */
export type IncludeEntitiesParameter = string;

export type GetBoundingBoxMinXMinYMaxXMaxYEntitiesParams = {
  include?: IncludeEntitiesParameter;
  exclude?: ExcludeEntitiesParameter;
  startTime?: StartTimeParameter;
  endTime?: EndTimeParameter;
  instance?: InstanceParameter;
};

export type GetBoundingBoxMinXMinYMaxXMaxYPointsParams = {
  include?: IncludeEntitiesParameter;
  exclude?: ExcludeEntitiesParameter;
  startTime?: StartTimeParameter;
  endTime?: EndTimeParameter;
  instance?: InstanceParameter;
};

export type GetBoundingBoxMinXMinYMaxXMaxYCountParams = {
  include?: IncludeEntitiesParameter;
  exclude?: ExcludeEntitiesParameter;
  startTime?: StartTimeParameter;
  endTime?: EndTimeParameter;
  instance?: InstanceParameter;
};

export type GetPolygonPointsPointsParams = {
  include?: IncludeEntitiesParameter;
  exclude?: ExcludeEntitiesParameter;
  startTime?: StartTimeParameter;
  endTime?: EndTimeParameter;
  instance?: InstanceParameter;
};

export type GetPolygonPointsCountParams = {
  include?: IncludeEntitiesParameter;
  exclude?: ExcludeEntitiesParameter;
  startTime?: StartTimeParameter;
  endTime?: EndTimeParameter;
  instance?: InstanceParameter;
};

export type WebhookBreachType = typeof WebhookBreachType[keyof typeof WebhookBreachType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const WebhookBreachType = {
  enter: 'enter',
  exit: 'exit',
} as const;

export type WebhookBreach = {
  type: WebhookBreachType;
  latitude: Latitude;
  longitude: Longitude;
  altitude: Altitude;
  id: Id;
  time: Time;
  payload: Payload;
  /** The name of the geofence that was triggered */
  geofence: string;
  /** The Data Flow Index that triggered the geofence */
  instance: string;
};

/**
 * # A payload sent to your server when a geofence breach occurs

 */
export interface Webhook {
  breach: WebhookBreach;
  /** A verifiable signature of the event */
  signature: string;
}

export type GeofenceAlerts = {
  /** Send alerts when an entity exits a geofence */
  exit?: boolean;
  /** Send alerts when an entity enters a geofence */
  enter?: boolean;
};

export interface Geofence {
  /** A name that you wish to use to refer to the geofence */
  name: string;
  /** The name of the polygon you wish to use for this geofence */
  polygon: string;
  /** The instance of the Data Flow Index associated with this geofence */
  readonly instance?: string;
  alerts?: GeofenceAlerts;
  /** # A url on your server that breach events should be sent to.
You'll be POSTed an object conforming to the POST /webhook-example definition in this schema
 */
  webhook: string;
  /** A list of entities to include */
  include?: Id[];
  /** A list of entities to include */
  exclude?: Id[];
  /** # A secret that will be used to create a sha256hmac signature for each breach
You should specify this. It allows you to verify that the request has really come from us
 */
  secret?: string;
  readonly createdAt?: string;
}

export type GeofencesGeofencesItem = {
  /** The name of the geofence */
  name?: string;
  /** The name of the polygon on which the geofence is built */
  polygon?: string;
  /** The date the polygon was added */
  createdAt?: string;
};

export interface Geofences {
  /** Only items before this time are returned */
  before?: string;
  /** The number of items retrieved. */
  count?: number;
  geofences?: GeofencesGeofencesItem[];
}

export interface Polygon {
  /** A name for your polygon. It's a good idea to use namespaces for these. To avoid collisions */
  name: string;
  points: number[][];
  readonly createdAt: string;
}

export type PolygonsPolygonsItem = {
  /** The name of the polygon */
  name: string;
  /** The number of points of which the polygon is made */
  count: number;
  /** The date the polygon was added */
  createdAt: unknown;
};

export interface Polygons {
  /** Only items before this time are returned */
  before: string;
  /** The number of items retrieved */
  count: number;
  polygons: PolygonsPolygonsItem[];
}

export interface PointsResponse {
  instance: string;
  points: Point[];
}

export interface CountResponse {
  instance: string;
  count: number;
}

export interface EntityResponse {
  instance: string;
  entities: Id[];
}

/**
 * An instance of the Data Flow Index that the query should be routed to
 */
export type InstanceName = string;

export interface Instance {
  name: InstanceName;
  /** Whether requests are routed to this instance by default. All the queries take an optional `instance` query parameter which will override this default value */
  default: boolean;
}

export interface InsertionResult {
  inserted: number;
  invalid: number;
}

/**
 * As defined by https://tools.ietf.org/html/rfc3339#section-5.6 Times in the future will be rejected.
 */
export type Time = string;

export type Coordinate = [number, number];

export interface Point {
  coordinate: Coordinate;
  time?: Time;
  id: Id;
  payload?: Payload;
}

export type Points = Point[];

export type MercatorLatitude = number;

export type Latitude = number;

export type Longitude = number;

/**
 * Altitudes are restricted to the distance down to the center of the earth, and up to the moon.
 */
export type Altitude = number;

/**
 * An arbitrary string that contains metadata useful for the application
 */
export type Payload = string;

/**
 * A unique identifier for the entity. Both uuids and int64s are accepted.
 */
export type Id = number | string;

/**
 * The user id of the currently authenticated user
 */
export type UserId = string;

export interface ErrorResponse {
  /** The error message */
  error?: string;
  /** A complete list of error messages (notably with schema validation failures) */
  errors?: string[];
  /** The system transaction */
  transactionId?: string;
}

const DFI_URL = 'https://api.gs.com/df';

export const payloadToMarker = (id: string, payload: string) => {
  const [, , , startTime] = payload.split('|');
  return `Route ${id.split('|').join(' / ')} -  left at ${startTime}`;
};

export const idTransform = (id: Id, payload: string | undefined) => {
  const reg = String([payload]).split('|')[1];
  const newId = String(id).indexOf('|') === -1 ? `${id}|${reg}` : id;
  return newId;
};

/**
 * ## This schema

 */
export const getSchema = async ({ baseURL = DFI_URL, ...options }: RequestOptions) => {
  const response = await fetch(`${baseURL}/schema`, { ...options, method: 'GET' });

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json();
};

/**
 * ## Instance List
Returns the list of instances of the Data Flow Index available to use

 */
export const getInstances = async ({ baseURL = DFI_URL, ...options }: RequestOptions) => {
  const response = await fetch(`${baseURL}/instances`, {
    ...options,
    method: 'GET',
  });

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json() as Promise<Instance[]>;
};

/**
 * ## Change your default Data Flow Index instance.
This won't affect any running queries, only future ones.

 */
export const putInstancesDefault = async (
  body: string,
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(`${baseURL}/instances/default`, {
    ...options,
    method: 'PUT',
    body,
  });

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json();
};

/**
 * ## Version of the Data Flow Index.

 */
export const getVersion = async (
  params: GetVersionParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/version?${new URLSearchParams(pruneNullableValuesFromObject(params))}`,
    {
      ...options,
      method: 'GET',
    },
  );

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.text();
};

/**
 * ## Inserts points in a Data Flow Index. 
Both `application/json` and `text/csv` are accepted.

### Uploading JSON,

 - There is a limit of a thousand points in each request. 
 - The full payload is validated before any insertion is done. 
 - If any points are invalid, the whole payload is rejected with a `400` status.

### Streaming CSV 

  - It's possible to stream as many points in a single HTTP request as required. 
  - Any points which fail validation are discarded. You're given a result if you close the stream
  - Insertion to the index is done as rows arrive and points are immediately available to query.

### Coordinate arrays

For the sake of terseness rather than using the words `latitude` and `longitude` in JSON entity bodies, 
points are represented in coordinate arrays.
These are in the order `[latitude, longitude, altitude]` where altitude is optional.

 */
export const postPointsInsert = async <T extends 'application/json' | 'text/csv'>(
  body: Points | string | ReadableStream,
  params: PostPointsInsertParams = {},
  {
    baseURL = DFI_URL,
    ...options
  }: RequestOptions & {
    headers: RequestOptions['headers'] & { 'Content-Type': T };
  },
): Promise<T extends 'application/json' ? PostPointsInsert201 : string> => {
  const response = await fetch(
    `${baseURL}/points/insert?${new URLSearchParams(pruneNullableValuesFromObject(params))}`,
    {
      ...options,
      method: 'POST',
      body: Array.isArray(body) ? JSON.stringify(body) : (body as string | ReadableStream),
    },
  );

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return options.headers['Content-Type'] === 'application/json' ? response.json() : response.text();
};

/**
 * ## Retrieves the points for a given entity

 */
export const getHistoryId = async (
  id: number | string,
  params: GetHistoryIdParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const q: {
    startTime?: string;
    endTime?: string;
    instance?: string;
  } = paramsToParamsWithISOStrings(params);

  const [routeId] = String(id).split('|');
  const response = await fetch(`${baseURL}/history/${routeId}?${new URLSearchParams(q)}`, {
    ...options,
    method: 'GET',
  });

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json() as Promise<GetHistoryId200>;
};

/**
 * ## Save a polygon

 */
export const postPolygons = async (
  polygon: Polygon,
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(`${baseURL}/polygons`, {
    ...options,
    method: 'POST',
    body: JSON.stringify(polygon),
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json();
};

/**
 * ## Retrieves a list of saved polygons

You can upload and easily manage complex polygons with many points and refer to them by name in other APIs.

In order to create a geofence you must first have a saved polygon to refer to.

 */
export const getPolygons = async (
  params: GetPolygonsParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/polygons?${new URLSearchParams(pruneNullableValuesFromObject(params))}`,
    {
      ...options,
      method: 'GET',
    },
  );

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json() as Promise<Polygons>;
};

/**
 * ## Retrieves a saved polygon

 */
export const getPolygonsName = async (
  name: string,
  params: GetPolygonsNameParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/polygons/${name}?${new URLSearchParams(pruneNullableValuesFromObject(params))}`,
    {
      ...options,
      method: 'GET',
    },
  );

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json() as Promise<Polygon>;
};

/**
 * ## Deletes a saved polygon
If you have any geofences referring to this polygon, they must be deleted first.

 */
export const deletePolygonsName = async (
  name: string,
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(`${baseURL}/polygons/${name}`, {
    ...options,
    method: 'DELETE',
  });

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json();
};

/**
 * ## A list of geofences

 */
export const getGeofences = async (
  params: GetGeofencesParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/geofences?${new URLSearchParams(pruneNullableValuesFromObject(params))}`,
    {
      ...options,
      method: 'GET',
    },
  );

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json() as Promise<Geofences>;
};

/**
 * ## Create a new geofence

 */
export const postGeofences = async (
  geofence: Geofence,
  params: PostGeofencesParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/geofences?${new URLSearchParams(pruneNullableValuesFromObject(params))}`,
    {
      ...options,
      method: 'POST',
      body: JSON.stringify(geofence),
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json();
};

/**
 * ## Retrieve details of a geofence

 */
export const getGeofencesName = async (
  name: string,
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(`${baseURL}/geofences/${name}`, {
    ...options,
    method: 'GET',
  });

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json() as Promise<Geofence>;
};

/**
 * ## Remove a geofence

 */
export const deleteGeofencesName = async (
  name: string,
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(`${baseURL}/geofences/${name}`, {
    ...options,
    method: 'DELETE',
  });

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json();
};

/**
 * ## Retrieves the count of entities currently within a given polygon.
Providing both `include` and `exclude` query parameters will result in failure

 */
export const getPolygonPointsCount = async (
  points: string,
  params: GetPolygonPointsCountParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/polygon/${points}/count?${new URLSearchParams(
      pruneNullableValuesFromObject(params),
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

  return response.json() as Promise<CountResponse>;
};

export type PostPolygonCountBody = GetPolygonPointsCountParams & { polygon: string | Coordinate[] };

export const postPolygonCount = async (
  { instance, ...body }: PostPolygonCountBody,
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/polygon/count?${new URLSearchParams(pruneNullableValuesFromObject({ instance }))}`,
    {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json() as Promise<CountResponse>;
};

/**
 * ## Retrieves the entities currently within a given polygon, and their locations
Providing both `include` and `exclude` query parameters will result in failure

 */
export const getPolygonPointsPoints = async (
  points: string,
  params: GetPolygonPointsPointsParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/polygon/${points}/points?${new URLSearchParams(
      pruneNullableValuesFromObject(params),
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

  return response.json() as Promise<PointsResponse>;
};

export type PostPolygonPointsBody = GetPolygonPointsPointsParams & {
  polygon: string | Coordinate[];
};

export const postPolygonPoints = async (
  { instance, ...body }: PostPolygonPointsBody,
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/polygon/points?${new URLSearchParams(pruneNullableValuesFromObject({ instance }))}`,
    {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json() as Promise<PointsResponse>;
};

/**
 * ## Retrieves a list of entities currently within a given polygon
Providing both `include` and `exclude` query parameters will result in failure

 */
export const getPolygonPointsEntities = async (
  points: string,
  params: GetPolygonPointsEntitiesParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/polygon/${points}/entities?${new URLSearchParams(
      pruneNullableValuesFromObject(params),
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

  return response.json() as Promise<EntityResponse>;
};

export type PostPolygonEntitiesBody = GetPolygonPointsEntitiesParams & {
  polygon: string | Coordinate[];
};

export const postPolygonEntities = async (
  { instance, ...body }: PostPolygonEntitiesBody,
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/polygon/entities?${new URLSearchParams(
      pruneNullableValuesFromObject({ instance }),
    )}`,
    {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json() as Promise<EntityResponse>;
};

/**
 * ## Returns the count of entities within a given bounding box
 - Providing both `include` and `exclude` query parameters will result in failure
 - It's not possible to query bounding boxes within the polar region, as the Web Mercator projection is used.
 - Latitudes are limited to ±85.051129°

 */
export const getBoundingBoxMinXMinYMaxXMaxYCount = async (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  params: GetBoundingBoxMinXMinYMaxXMaxYCountParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/bounding-box/${minX}/${minY}/${maxX}/${maxY}/count?${new URLSearchParams(
      pruneNullableValuesFromObject(params),
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

  return response.json() as Promise<CountResponse>;
};

/**
 * ## Retrieves the entities within a given bounding box, and their locations

 - Providing both `include` and `exclude` query parameters will result in failure
 - It's not possible to query bounding boxes within the polar region, as the Web Mercator projection is used.
 - Latitudes are limited to ±85.051129°

 */
export const getBoundingBoxMinXMinYMaxXMaxYPoints = async (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  params: GetBoundingBoxMinXMinYMaxXMaxYPointsParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/bounding-box/${minX}/${minY}/${maxX}/${maxY}/points?${new URLSearchParams(
      pruneNullableValuesFromObject(params),
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

  return response.json() as Promise<PointsResponse>;
};

/**
 * ## Retrieves the entities within a given bounding box
 - Providing both `include` and `exclude` query parameters will result in failure
 - It's not possible to query bounding boxes within the polar region, as the Web Mercator projection is used.
 - Latitudes are limited to ±85.051129°

 */
export const getBoundingBoxMinXMinYMaxXMaxYEntities = async (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  params: GetBoundingBoxMinXMinYMaxXMaxYEntitiesParams = {},
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(
    `${baseURL}/bounding-box/${minX}/${minY}/${maxX}/${maxY}/entities?${new URLSearchParams(
      pruneNullableValuesFromObject(params),
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

  return response.json() as Promise<EntityResponse>;
};

/**
 * This is the payload you will receive when your server is POSTed a breach event.

If you've specified a secret for your geofence, it will be verifiable using this node.js snippet.
```
const crypto = require('crypto');

const secret = 'THE_SECRET_FOR_THE_GEOFENCE';
const plainText = [id, geofence, latitude, longitude].join(",");

const hmac = crypto.createHmac('sha256', secret);
const hash = hmac.update(plainText).digest('hex');

if (hash === signature) { console.log("Signature verified"); }
```

 */
export const postGeofenceBreachEvent = async (
  webhook: Webhook,
  { baseURL = DFI_URL, ...options }: RequestOptions,
) => {
  const response = await fetch(`${baseURL}/geofence-breach-event`, {
    ...options,
    method: 'POST',
    body: JSON.stringify(webhook),
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  if (response.status >= 400) {
    const error = await getErrorFromResponse(response);

    throw error;
  }

  return response.json();
};

export type GetSchemaResult = void;
export type GetInstancesResult = Instance[];
export type PutInstancesDefaultResult = void;
export type GetVersionResult = string;
export type PostPointsInsertResult = PostPointsInsert201;
export type GetHistoryIdResult = GetHistoryId200;
export type PostPolygonsResult = void;
export type GetPolygonsResult = Polygons;
export type GetPolygonsNameResult = Polygon;
export type DeletePolygonsNameResult = void;
export type GetGeofencesResult = Geofences;
export type PostGeofencesResult = void;
export type GetGeofencesNameResult = Geofence;
export type DeleteGeofencesNameResult = void;
export type GetPolygonPointsCountResult = CountResponse;
export type GetPolygonPointsPointsResult = PointsResponse;
export type GetPolygonPointsEntitiesResult = EntityResponse;
export type GetBoundingBoxMinXMinYMaxXMaxYCountResult = CountResponse;
export type GetBoundingBoxMinXMinYMaxXMaxYPointsResult = PointsResponse;
export type GetBoundingBoxMinXMinYMaxXMaxYEntitiesResult = EntityResponse;
export type PostGeofenceBreachEventResult = void;
