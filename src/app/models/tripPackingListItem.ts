/** Trip Packing List Item model */

import { AbstractPackingListItem } from './abstractPackingListItem';
import { PackingListItem } from './packingListItem';

export class TripPackingListItem extends AbstractPackingListItem {

  tripId: number;
  packingListItemId: number;
  item: PackingListItem;

  constructor(data: any) {

    super(data);
    this.tripId = data.trip_id;
    this.packingListItemId = data.packing_list_item_id;
    this.item = new PackingListItem(data.item);

  }

  /**
   * Returns the best fit for the name attribute based on
   * the application language. It will use the
   * contained PackingListItem's attributes if the model's
   * are null.
   */
  getName() {
    return this.geti18nAttribute('name');
  }

  /**
   * Returns the best fit for the remarks attribute based on
   * the application language. It will use the
   * contained PackingListItem's attributes if the model's
   * are null.
   */
  getRemarks() {
    return this.geti18nAttribute('remarks');
  }

  /**
   * Returns the best fit for the description attribute based on
   * the application language. It will use the
   * contained PackingListItem's attributes if the model's
   * are null.
   */
  getDescription() {
    return this.geti18nAttribute('description');
  }

  /**
   * Returns the best fit for the footer attribute based on
   * the application language. It will use the
   * contained PackingListItem's attributes if the model's
   * are null.
   */
  getFooter() {
    return this.geti18nAttribute('footer');
  }

  /**
   * Returns the image property value if not empty, otherwise
   * the item.image property.
   */
  getImage() {
    if (!this.empty(this.image)) {
      return this.image;
    }
    return this.item.image;
  }

  /**
   * Returns the bring property value if not empty, otherwise the
   * item.bring property value if not empty, otherwise null.
   */
  getBring() {
    if (this.bring !== null) {
      return this.bring;
    }
    return this.item.bring;
  }

  /**
   * Return the css class corresponding to the item bring value.
   */
  getBringClass() {
    const num = this.getBring();

    if (num === 0) {
      return 'bring';
    } else if (num === 1) {
      return 'bring-optional';
    } else {
      return 'not-bring';
    }
  }

  /**
   * Returns the item's quantity property value if not empty, if empty it will
   * return the item.quantity value, if that one is empty as well it will return
   * null.
   */
  getQuantity() {
    if (this.quantity !== null && this.quantity.trim() !== '') {
      return this.quantity;
    } else if (this.item.quantity !== null && this.item.quantity.trim() !== '') {
      return this.item.quantity;
    }
    return null;
  }

  /**
   * Returns the best i18n fit for the required attribute.
   */
  private geti18nAttribute(name: string) {

    let localizedName = '';

    if (this.lang === 1) {
      localizedName = name + 'Zh';
      const val = this.getAttribute(localizedName);
      if (val !== null) {
        return val;
      }
    }

    // If not localized version is found return default
    return this.getAttribute(name);
  }

  /**
   * Return the best possible match for
   */
  private getAttribute(name: string): string {
    if (!this.empty(this[name])) {
      return this[name];
    } else if (!this.empty(this.item[name])) {
      return this.item[name];
    } else {
      return null;
    }
  }

  /**
   * Returns whether the parameter is empty
   */
  private empty(value: string): boolean {

    if (value === null || value.trim() === '') {
      return true;
    }

    return false;

  }

}
