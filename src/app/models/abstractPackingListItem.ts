/* Abstract PackingListItem */

export abstract class AbstractPackingListItem {
  nameEn?: string;
  nameZh?: string;
  remarksEn?: string;
  remarksZh?: string;
  descriptionEn?: string;
  descriptionZh?: string;
  footerEn?: string;
  footerZh?: string;
  image?: string;
  bring?: number;
  quantity?: string;
  order?: number;
  lang?: string;

  constructor(data: any) {
    this.nameEn = data.name_en;
    this.nameZh = data.name_zh;
    this.remarksEn = data.remarks_en;
    this.remarksZh = data.remarks_zh;
    this.descriptionEn = data.description_en;
    this.descriptionZh = data.description_zh;
    this.footerEn = data.footer_en;
    this.footerZh = data.footer_zh;
    this.image = data.image;
    this.bring = data.bring;
    this.quantity = data.quantity;
    this.order = data.order;
    this.lang = data.lang || 'en';
  }
}
