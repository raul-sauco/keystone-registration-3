export class School {
  id: string;
  name: string;
  nameZh: string;
  useHouse: boolean;
  useRoomNumber: boolean;

  constructor(json: {
    id?: string | number | null;
    name?: string;
    nameZh?: string;
    use_house?: boolean | number | string | null;
    use_room_number?: boolean | number | string | null;
  }) {
    this.id = String(json.id) ?? '';
    this.name = json.name ?? '';
    this.nameZh = json.nameZh ?? '';
    this.useHouse =
      json.use_house === true ||
      json.use_house === 'true' ||
      json.use_house === 1 ||
      json.use_house === '1';
    this.useRoomNumber =
      json.use_room_number === true ||
      json.use_room_number === 'true' ||
      json.use_room_number === 1 ||
      json.use_room_number === '1';
  }
}
