import { UserType } from './credentials';

export interface TripCodes {
  tripId: number;
  tripName: string;
  code: number;
  type: UserType;
}

// export interface TripCodesJson {
//   id: string;
//   name: string;
//   code: number;
//   type: string;
// }
//
// export class TripCodes {
//   private constructor(
//     readonly id: string,
//     readonly name: string,
//     readonly code: number,
//     readonly type: string,
//   ) {}
//
//   static fromJson(json: TripCodesJson): TripCodes {
//     return new TripCodes(
//       json.id,
//       json.name,
//       json.code,
//       json.type,
//     );
//   }
// }
