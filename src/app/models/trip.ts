/**
 * Trip model
 */
export class Trip {
  private _id: number;
  private _nameEn: string | null;
  private _nameZh: string | null;

  constructor(tripJson: any) {
    this._id = tripJson.id;
    this._nameEn = tripJson.name_en;
    this._nameZh = tripJson.name_zh;
  }

  get nameEn(): string {
    return this._nameEn ?? '';
  }

  get nameZh(): string {
    return this._nameZh ?? '';
  }

  get id(): number {
    return this._id;
  }
}
