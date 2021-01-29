export class Gps {
  id: number;
  lat: string;
  lng: string;
  constructor(gpsJson: any) {
    this.id = gpsJson.id;
    this.lat = gpsJson.lat;
    this.lng = gpsJson.lng;
  }
}
