export class School {
  nameEn: string;
  nameZh: string;
  useStudentId: boolean;
  useHouse: boolean;
  useRoomNumber: boolean;
  useHomeroom: boolean;
  useGrade: boolean;

  constructor(json: {
    name_en?: string;
    name_zh?: string;
    use_student_id?: boolean | number | string | null;
    use_house?: boolean | number | string | null;
    use_room_number?: boolean | number | string | null;
    use_homeroom?: boolean | number | string | null;
    use_grade?: boolean | number | string | null;
  }) {
    this.nameEn = json.name_en ?? '';
    this.nameZh = json.name_zh ?? '';
    this.useStudentId = this.setMaybeNullBool(json.use_student_id);
    this.useHouse = this.setMaybeNullBool(json.use_house);
    this.useRoomNumber = this.setMaybeNullBool(json.use_room_number);
    this.useHomeroom = this.setMaybeNullBool(json.use_homeroom);
    this.useGrade = this.setMaybeNullBool(json.use_grade);
  }

  setMaybeNullBool(val: boolean | string | number | null | undefined): boolean {
    return val === true || val === 'true' || val === 1 || val === '1';
  }
}
