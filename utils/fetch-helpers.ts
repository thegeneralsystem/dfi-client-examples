import type { GetHistoryIdParams } from './dfi';

type AsURLSearchParams<Params extends Record<string, unknown>> = keyof Params extends undefined
  ? {
      [index in keyof Params]?: string | undefined;
    }
  : {
      [index in keyof Params]: string;
    };

export const getErrorFromResponse = async (response: Response) => {
  const errorText = await response.text();

  try {
    const json = JSON.parse(errorText);

    return new Error(json.message ?? json.error);
  } catch (e) {
    return new Error(errorText ?? response.statusText);
  }
};

export const pruneNullableValuesFromObject = <T extends Record<string, unknown>>(obj: T) =>
  Object.entries(obj)
    .filter(([, value]) => typeof value !== 'undefined')
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}) as AsURLSearchParams<T>;

export const paramsToParamsWithISOStrings = (
  params: GetHistoryIdParams,
): {
  startTime?: string;
  endTime?: string;
  instance?: string;
} => {
  const queryParams: {
    startTime?: string;
    endTime?: string;
    instance?: string;
  } = {};
  if (params.startTime) {
    queryParams.startTime = params.startTime.toISOString();
  }
  if (params.endTime) {
    queryParams.endTime = params.endTime.toISOString();
  }
  if (params.instance) {
    queryParams.instance = params.instance;
  }
  return queryParams;
};
