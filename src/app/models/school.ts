export class School {
  name: string;
  nameZh: string;
  useHouse: boolean;
  useRoomNumber: boolean;
  useHomeroom: boolean;
  useGrade: boolean;

  constructor(json: {
    name?: string;
    nameZh?: string;
    use_house?: boolean | number | string | null;
    use_room_number?: boolean | number | string | null;
    use_homeroom?: boolean | number | string | null;
    use_grade?: boolean | number | string | null;
  }) {
    this.name = json.name ?? '';
    this.nameZh = json.nameZh ?? '';
    this.useHouse = this.setMaybeNullBool(json.use_house);
    this.useRoomNumber = this.setMaybeNullBool(json.use_room_number);
    this.useHomeroom = this.setMaybeNullBool(json.use_homeroom);
    this.useGrade = this.setMaybeNullBool(json.use_grade);
  }

  setMaybeNullBool(val: boolean | string | number | null | undefined): boolean {
    return val === true || val === 'true' || val === 1 || val === '1';
  }
}
