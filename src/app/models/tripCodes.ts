import { UserType } from './credentials';

export interface TripCodesJson {
  trip_id: string;
  code: number;
  trip_name_en: string;
  trip_name_zh: string;
  type: number;
}

export class TripCodes {
  private constructor(
    readonly tripId: string,
    readonly code: number,
    readonly tripNameEn: string,
    readonly tripNameZh: string,
    readonly type: UserType,
  ) {}

  static fromJson(json: TripCodesJson): TripCodes {
    return new TripCodes(
      json.trip_id,
      json.code,
      json.trip_name_en,
      json.trip_name_zh,
      json.type as UserType,
    );
  }
}
