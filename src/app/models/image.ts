export interface ImageJson {
  id: number;
  name: string | null;
}

/**
 * Image model.
 */
export class Image {
  private constructor(
    readonly _id: number,
    readonly _name: string,
  ) {}

  static fromJson(json: ImageJson): Image {
    return new Image(json.id, json.name ?? '');
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }
}
