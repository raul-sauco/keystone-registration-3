import { Image } from './image';

/**
 * Model for Supplier data that gets displayed in the accommodation page.
 */
export class Supplier {
  id: number;
  name?: string;
  nameZh?: string;
  images?: Image[];
  constructor(supplierJson: {
    id: number;
    name: string;
    name_zh: string;
    images: any;
  }) {
    this.id = supplierJson.id;
    this.name = supplierJson.name;
    this.nameZh = supplierJson.name_zh;
    if (supplierJson.images) {
      this.images = supplierJson.images.map((i: any) => new Image(i));
    }
  }
}
