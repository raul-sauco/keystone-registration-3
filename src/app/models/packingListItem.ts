/** Packing List Item model */

import {AbstractPackingListItem} from './abstractPackingListItem';

export class PackingListItem extends AbstractPackingListItem {

  id: number;

  constructor(data: any) {

    super(data);
    this.id = data.id;

  }

}
