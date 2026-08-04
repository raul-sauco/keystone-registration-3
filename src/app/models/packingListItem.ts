export interface PackingListItemJson {
  name_en: string | null;
  name_zh: string | null;
  remarks_en: string | null;
  remarks_zh: string | null;
  description_en: string | null;
  description_zh: string | null;
  footer_en: string | null;
  footer_zh: string | null;
  image: string | null;
  bring: number;
  quantity: string | null;
  order: number | null;
}

export class PackingListItem {
  private constructor(
    readonly _nameEn: string,
    readonly _nameZh: string,
    readonly _remarksEn: string,
    readonly _remarksZh: string,
    readonly _descriptionEn: string,
    readonly _descriptionZh: string,
    readonly _footerEn: string,
    readonly _footerZh: string,
    readonly _image: string,
    readonly _bring: number,
    readonly _quantity: string,
    readonly _order: number,
  ) {}

  static fromJson(json: PackingListItemJson) {
    return new PackingListItem(
      json.name_en ?? '',
      json.name_zh ?? '',
      json.remarks_en ?? '',
      json.remarks_zh ?? '',
      json.description_en ?? '',
      json.description_zh ?? '',
      json.footer_en ?? '',
      json.footer_zh ?? '',
      json.image ?? '',
      json.bring,
      json.quantity ?? '',
      json.order ?? 1000,
    );
  }

  getName(lang: string): string {
    return (lang.includes('zh') ? this._nameZh : this._nameEn) ?? '';
  }

  getRemarks(lang: string): string {
    return (lang.includes('zh') ? this._remarksZh : this._remarksEn) ?? '';
  }

  getDescription(lang: string): string {
    return (lang.includes('zh') ? this._descriptionZh : this._descriptionEn) ?? '';
  }

  getFooter(lang: string): string {
    return (lang.includes('zh') ? this._footerZh : this._footerEn) ?? '';
  }

  getImage(): string {
    return this._image;
  }

  getQuantity(): string {
    return this._quantity;
  }

  getBringClass() {
    const num = this._bring;

    if (num === 0) {
      return 'bring';
    } else if (num === 1) {
      return 'bring-optional';
    } else {
      return 'not-bring';
    }
  }

  get bring(): number {
    return this._bring;
  }

  get order(): number {
    return this._order;
  }
}
