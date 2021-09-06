/**
 * Guide model class
 */
export class Guide {
  private nameEn: string;
  private nameZh?: string;
  private bioEn: string;
  private bioZh?: string;
  private avatar: string;

  constructor(guide: any) {
    this.nameEn = guide.nickname;
    this.nameZh = guide.nickname_zh;
    this.bioEn = guide.bio;
    this.bioZh = guide.bio_zh;

    // Assign default avatar if empty
    this.avatar = guide.avatar || 'user.jpeg';
  }

  /**
   * Name property getter.
   *
   * @param string lang current application language
   */
  getName(lang: string): string {
    return this.nameZh && lang.indexOf('zh') !== -1 ? this.nameZh : this.nameEn;
  }

  /**
   * Bio property getter.
   *
   * @param string lang current application language
   */
  getBio(lang: string): string {
    return this.bioZh && lang.indexOf('zh') !== -1 ? this.bioZh : this.bioEn;
  }

  /**
   * Avatar property getter.
   */
  getAvatar(): string {
    return this.avatar;
  }
}
