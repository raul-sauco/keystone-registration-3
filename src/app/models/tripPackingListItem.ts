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
   * Returns the order property value if not empty, otherwise the
   * item.order property value if not empty, otherwise null.
   */
  getOrder(): number | null {
    if (this.order !== null) {
      return this.order || null;
    }
    return this.item.order || null;
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
   * Check wether this PackingListItem's quantity value is greater than 1
   * @returns boolean
   */
  hasQuantityMoreThanOne(): boolean {
    if (this.getQuantity === null) {
      return false;
    }
    const quantity: number = +this.getQuantity()!;
    return quantity > 1;
  }

  /**
   * Returns the item's quantity property value if not empty, if empty it will
   * return the item.quantity value, if that one is empty as well it will return
   * null.
   */
  getQuantity(): string | null {
    if (this.quantity !== null && this.quantity?.trim() !== '') {
      return this.quantity || null;
    } else if (
      this.item.quantity !== null &&
      this.item.quantity?.trim() !== ''
    ) {
      return this.item.quantity || null;
    }
    return null;
  }

  /**
   * Returns the best i18n fit for the required attribute.
   */
  geti18nAttribute(name: keyof TripPackingListItem) {
    if (this.lang && this.lang.indexOf('zh') !== -1) {
      const localizedName = (name + 'Zh') as keyof TripPackingListItem;
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
  private getAttribute(name: keyof TripPackingListItem): any {
    if (!this.empty(this[name])) {
      return this[name];
    }
    const plAttrName = name as keyof PackingListItem;
    if (!this.empty(this.item[plAttrName])) {
      return this.item[plAttrName];
    }
    return null;
  }

  /**
   * Returns whether the parameter is empty
   */
  private empty(value: any): boolean {
    if (value === undefined || value === null || value.trim() === '') {
      return true;
    }
    return false;
  }
}
