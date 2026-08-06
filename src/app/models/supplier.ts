import { Image, ImageJson } from './image';

export interface SupplierJson {
  id: number;
  name: string | null;
  name_zh: string | null;
  images: ImageJson[] | null;
  official_phone: string | null;
  address: string | null;
  address_zh: string | null;
  c_trip_url: string | null;
}

/**
 * Supplier model.
 */
export class Supplier {
  private constructor(
    readonly _id: number,
    readonly _name: string,
    readonly _nameZh: string,
    readonly _images: Image[],
    readonly _phone: string,
    readonly _address: string,
    readonly _addressZh: string,
    readonly _cTripUrl: string,
  ) {}

  static fromJson(json: SupplierJson): Supplier {
    return new Supplier(
      json.id,
      json.name ?? '',
      json.name_zh ?? '',
      (json.images ?? []).map(Image.fromJson),
      json.official_phone ?? '',
      json.address ?? '',
      json.address_zh ?? '',
      json.c_trip_url ?? '',
    );
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get nameZh(): string {
    return this._nameZh;
  }

  get images(): Image[] {
    return this._images;
  }

  get phone(): string {
    return this._phone;
  }

  get address(): string {
    return this._address;
  }

  get addressZh(): string {
    return this._addressZh;
  }

  get cTripUrl(): string {
    return this._cTripUrl;
  }

  /**
   * Return the localized supplier name.
   */
  getName(lang: string): string {
    return lang.startsWith('zh') ? this._nameZh : this._name;
  }

  /**
   * Return the localized supplier address.
   */
  getAddress(lang: string): string {
    return lang.startsWith('zh') ? this._addressZh : this._address;
  }
}
