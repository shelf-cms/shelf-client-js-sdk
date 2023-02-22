/** Represents a firebase GeoPoint value */
export default class GeoPoint {
    latitude: number;
    longitude: number;
    constructor(latitude: number, longitude: number);
    toJSON(): {
        geoPointValue: {};
    };
}
