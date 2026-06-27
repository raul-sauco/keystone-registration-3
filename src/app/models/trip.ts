export interface TripJson {
  id: number;
  name_en: string;
  name_zh: string;
  accept_direct_payment: boolean | number;
  is_staffing_confirmed: boolean | number;
}

/**
 * Trip model
 */
export class Trip {
  private constructor(
    readonly _id: number,
    readonly _nameEn: string,
    readonly _nameZh: string,
    readonly _acceptDirectPayment: boolean,
    readonly _isStaffingConfirmed: boolean,
  ) {}

  static fromJson(json: TripJson) {
    return new Trip(
      json.id,
      json.name_en,
      json.name_zh,
      Boolean(json.accept_direct_payment),
      Boolean(json.is_staffing_confirmed),
    );
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

  get isStaffingConfirmed(): boolean {
    return this._isStaffingConfirmed;
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
