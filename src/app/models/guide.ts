export interface GuideJson {
  id: number;
  nickname: string | null;
  nickname_zh: string | null;
  bio: string | null;
  bio_zh: string | null;
  avatar: string | null;
}

/**
 * Guide model.
 */
export class Guide {
  private constructor(
    readonly _id: number,
    readonly _nameEn: string,
    readonly _nameZh: string,
    readonly _bioEn: string,
    readonly _bioZh: string,
    readonly _avatar: string,
  ) {}

  static fromJson(json: GuideJson): Guide {
    return new Guide(
      json.id,
      json.nickname ?? '',
      json.nickname_zh ?? '',
      json.bio ?? '',
      json.bio_zh ?? '',
      json.avatar || 'user.jpeg',
    );
  }

  get id(): number {
    return this._id;
  }

  get nameEn(): string {
    return this._nameEn;
  }

  get nameZh(): string {
    return this._nameZh;
  }

  get bioEn(): string {
    return this._bioEn;
  }

  get bioZh(): string {
    return this._bioZh;
  }

  get avatar(): string {
    return this._avatar;
  }

  getName(lang: string): string {
    return lang.startsWith('zh') && this._nameZh ? this._nameZh : this._nameEn;
  }

  getBio(lang: string): string {
    return lang.startsWith('zh') && this._bioZh ? this._bioZh : this._bioEn;
  }
}
