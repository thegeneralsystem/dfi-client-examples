type NumberString = `${number}`;

declare module 'gtfs-realtime-bindings' {
  export interface Entity {
    id: NumberString;
    vehicle:
      | {
          trip: {
            tripId: null;
            startTime?: undefined;
            startDate?: undefined;
            scheduleRelationship?: undefined;
            routeId: null;
          };
          position: {
            latitude: number;
            longitude: number;
            bearing: number;
          };
          currentStopSequence?: undefined;
          currentStatus?: undefined;
          timestamp: NumberString;
          vehicle: {
            id: string;
            label?: string;
          };
        }
      | {
          trip: {
            tripId: string;
            startTime: `${NumberString}:${NumberString}:${NumberString}`;
            startDate: NumberString;
            scheduleRelationship: 'SCHEDULED';
            routeId: NumberString;
          };
          position: {
            latitude: number;
            longitude: number;
            bearing: number;
          };
          currentStopSequence: number;
          currentStatus: 'IN_TRANSIT_TO' | 'STOPPED_AT';
          timestamp: NumberString;
          vehicle: {
            id: string;
            label?: string;
          };
        };
  }

  class GtfsRealtimeBindings {
    public static transit_realtime: {
      FeedMessage: {
        decode: <Decoded>(body: ArrayBuffer) => {
          entity: Entity[];
        };
      };
    };
  }
  export default GtfsRealtimeBindings;
}
