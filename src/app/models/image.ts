export interface ImageJson {
  id: number;
  name: string;
}

/**
 * Model for image data.
 */
export class Image {
  id: number;
  name: string;
  constructor(json: ImageJson) {
    this.id = json.id;
    this.name = json.name;
  }
}
