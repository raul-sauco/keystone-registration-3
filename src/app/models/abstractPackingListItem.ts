/* Abstract PackingListItem */

export abstract class AbstractPackingListItem {
  name?: string;
  nameZh?: string;
  remarks?: string;
  remarksZh?: string;
  description?: string;
  descriptionZh?: string;
  footer?: string;
  footerZh?: string;
  image?: string;
  bring?: number;
  quantity?: string;
  order?: number;
  lang?: string;

  constructor(data: any) {
    this.name = data.name;
    this.nameZh = data.name_zh;
    this.remarks = data.remarks;
    this.remarksZh = data.remarks_zh;
    this.description = data.description;
    this.descriptionZh = data.description_zh;
    this.footer = data.footer;
    this.footerZh = data.footer_zh;
    this.image = data.image;
    this.bring = data.bring;
    this.quantity = data.quantity;
    this.order = data.order;
    this.lang = data.lang || 'en';
  }
}
