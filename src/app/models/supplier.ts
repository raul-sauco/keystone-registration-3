import { Gps } from './gps';
import { Image } from './image';

/**
 * Model for Supplier data that gets displayed in the accommodation page.
 */
export class Supplier {
  id: number;
  name?: string;
  nameZh?: string;
  description?: string;
  descriptionZh?: string;
  gps?: Gps;
  images?: Image[];
  constructor(supplierJson: {
    id: number;
    name: string;
    name_zh: string;
    description: string;
    description_zh: string;
    gps: any;
    images: any;
  }) {
    this.id = supplierJson.id;
    this.name = supplierJson.name;
    this.nameZh = supplierJson.name_zh;
    this.description = supplierJson.description;
    this.descriptionZh = supplierJson.description_zh;
    if (supplierJson.gps) {
      this.gps = new Gps(supplierJson.gps);
    }
    if (supplierJson.images) {
      this.images = supplierJson.images.map((i: any) => new Image(i));
    }
  }
}
