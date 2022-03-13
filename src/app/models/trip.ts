/**
 * Trip model
 */
export class Trip {
  private _id: number;
  private _nameEn: string | null;
  private _nameZh: string | null;
  private _acceptDirectPayment: boolean;

  constructor(tripJson: any) {
    this._id = tripJson.id;
    this._nameEn = tripJson.name_en;
    this._nameZh = tripJson.name_zh;
    this._acceptDirectPayment = tripJson.accept_direct_payment === 1;
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

  get acceptDirectPayment(): boolean {
    return this._acceptDirectPayment;
  }

  /**
   * Return an i18n version of the trip's name.
   * @param lang the language to display.
   * @returns
   */
  getName(lang: string): string {
    return (lang.includes('zh') ? this._nameZh : this._nameEn) ?? '';
  }
}
