import { Image } from './image';

/**
 * Model for Supplier data that gets displayed in the accommodation page.
 */
export class Supplier {
  id: number;
  name?: string;
  nameZh?: string;
  images?: Image[];
  phone?: string;
  address?: string;
  addressZh?: string;
  cTripUrl?: string;

  constructor(supplierJson: {
    id: number;
    name: string;
    name_zh: string;
    images: any;
    phone?: string;
    address?: string;
    address_zh?: string;
    c_trip_url?: string;
  }) {
    this.id = supplierJson.id;
    this.name = supplierJson.name;
    this.nameZh = supplierJson.name_zh;
    if (supplierJson.images) {
      this.images = supplierJson.images.map((i: any) => new Image(i));
    }
    this.phone = supplierJson.phone;
    this.address = supplierJson.address;
    this.addressZh = supplierJson.address_zh;
    this.cTripUrl = supplierJson.c_trip_url;
  }
}
