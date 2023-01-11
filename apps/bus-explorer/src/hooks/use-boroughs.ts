import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { Feature, GeoJsonObject } from 'geojson';

export type GeoJsonFileData = Feature<
  GeoJsonObject & {
    type: 'MultiPolygon';
    coordinates: [[[number, number][]]];
  }
>;

export const boroughs = [
  'barking-and-dagenham',
  'barnet',
  'bexley',
  'brent',
  'bromley',
  'camden',
  'city-of-london',
  'croydon',
  'ealing',
  'enfield',
  'hounslow',
  'islington',
  'greenwich',
  'hackney',
  'hammersmith-and-fulham',
  'haringey',
  'harrow',
  'havering',
  'hillingdon',
  'kensington-and-chelsea',
  'kingston-upon-thames',
  'lambeth',
  'lewisham',
  'merton',
  'newham',
  'redbridge',
  'richmond-upon-thames',
  'southwark',
  'sutton',
  'tower-hamlets',
  'waltham-forest',
  'wandsworth',
  'westminster',
] as const;

export type BoroughName = typeof boroughs[number];

export const useBoroughGeoJsonQuery = (
  borough: BoroughName,
  options?: Omit<
    UseQueryOptions<GeoJsonFileData, unknown, GeoJsonFileData, ['borough', BoroughName]>,
    'enabled'
  >,
) =>
  useQuery(
    ['borough', borough],
    async () =>
      import(`../geojson/${borough}.json`).then(
        ({ default: feature }: { default: GeoJsonFileData }) => feature,
      ),
    {
      ...options,
      enabled: !!borough,
    },
  );

export const formatBoroughName = (borough: BoroughName) => {
  const upperCaseFirstChar = (token: string) =>
    token
      .split('')
      .map((char, index) => (index ? char : char.toUpperCase()))
      .join('');

  const tokens = borough.replace(/-/g, ' ').split(' ');

  const firstToken = tokens.shift() ?? '';

  const titleCasedFirstToken = upperCaseFirstChar(firstToken);

  if (!tokens.length) return titleCasedFirstToken;

  const lastToken = tokens.pop() ?? '';

  const titleCasedLastToken = upperCaseFirstChar(lastToken);

  return [titleCasedFirstToken, ...tokens, titleCasedLastToken].join(' ');
};
