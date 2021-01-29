/**
 * Model for image data.
 */
export class Image {
  id: number;
  name: string;
  constructor(imageJson: { id: number; name: string }) {
    this.id = imageJson.id;
    this.name = imageJson.name;
  }
}
