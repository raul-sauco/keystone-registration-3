export class School {
  name: string;
  nameZh: string;
  useHouse: boolean;
  useRoomNumber: boolean;

  constructor(json: {
    name?: string;
    nameZh?: string;
    use_house?: boolean | number | string | null;
    use_room_number?: boolean | number | string | null;
  }) {
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
