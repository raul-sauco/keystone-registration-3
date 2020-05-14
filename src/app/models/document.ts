/**
 * Document model class
 */
export class Document {

  /** A list of extensions we have icons for */
  private acceptedExtensions = [
    'aac', 'ai', 'aiff', 'avi', 'bmp', 'c', 'cpp', 'csv', 'dat', 'dmg', 'doc',
    'docx', 'dotx', 'dwg', 'dxf', 'eps', 'exe', 'flv', 'gif', 'h', 'hpp',
    'html', 'ics', 'iso', 'java', 'jpg', 'js', 'key', 'less', 'mid', 'mp3',
    'mp4', 'mpg', 'odf', 'ods', 'odt', 'otp', 'ots', 'ott', 'pdf', 'php',
    'png', 'ppt', 'psd', 'py', 'qt', 'rar', 'rb', 'rtf', 'sass', 'scss',
    'sql', 'tga', 'tgz', 'tiff', 'txt', 'wav', 'xls', 'xlsx', 'xml', 'yml', 'zip'
  ];

  private nameEn: string;
  private nameZh: string;
  private fileType: string;
  private version: string;
  private link: string;
  private size: number;

  constructor(doc: any) {
    this.nameEn = doc.name_en;
    this.nameZh = doc.name_zh;
    this.fileType = doc.file_type;
    this.version = doc.version;
    this.link = doc.link;
    this.size = doc.size;
  }

  /**
   * Get the best version of the name for the target language
   * @param lang target language
   */
  getNamei18n(lang?: string): string {
    if (lang && lang.indexOf('zh') !== -1 && this.nameZh) {
      return this.nameZh;
    }
    return this.nameEn;
  }

  /**
   * Get the link for the file icon
   */
  getIconLink(): string {
    const ext = this.acceptedExtensions.indexOf(this.fileType) === -1 ?
      '_blank' : this.fileType;
    return `file-icons/48px/${ext}.png`;
  }

  /**
   * Get the link for the file download
   */
  getDownloadLink(): string {
    return `files/${this.link}`;
  }

  /**
   * Get the human friendly version of the file size
   */
  getSize(): string {
    return this.humanFileSize(this.size, false);
  }

  /**
   * Utility function from https://stackoverflow.com/a/14919494/2557030
   * If needed somewhere else we could extract it to a helper class.
   *
   * @param bytes the size in bytes
   * @param si wether to use 1000 instead of 1024 for multiples
   */
  humanFileSize(bytes: number, si: boolean): string {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1) + ' ' + units[u];
  }
}
