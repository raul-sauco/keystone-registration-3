/**
 * A model for trips
 */
import { Event } from './event';
import { Guide } from './guide';
import { File } from './file';
import { Question } from './question';
import { TripPackingListItem } from './tripPackingListItem';

export class Trip {

  id: number;
  name: string;
  itinerary?: Event[];
  guides?: Guide[];
  packingListItems?: TripPackingListItem[];
  files?: File[];
  questions?: Question[];

  constructor(data: any) {

    this.id = data.id;
    this.name = data.name;
    this.itinerary = data.itinerary;
    this.guides = data.guides;
    this.packingListItems = [];
    this.files = data.files;
    this.questions = data.questions;

  }

  /**
   * Return packing list items with a bring value of 0 (Bring)
   */
  getPackingListItemsBring(): TripPackingListItem[] {
    return this.selectPackingListItemsByBring(0);
  }

  /**
   * Return packing list items with a bring value of 1 (Optional)
   */
  getPackingListItemsOptional(): TripPackingListItem[] {
    return this.selectPackingListItemsByBring(1);
  }

  /**
   * Return packing list items with a bring value of 2 (Don't bring)
   */
  getPackingListItemsNotBring(): TripPackingListItem[] {
    return this.selectPackingListItemsByBring(2);
  }

  /**
   * Construct a list of packing list items selecting them based on
   * their 'bring' value.
   */
  private selectPackingListItemsByBring(bring: number): TripPackingListItem[] {

    const items: TripPackingListItem[] = [];

    this.packingListItems.forEach(item => {
      if (item.bring === bring) {
        items.push(item);
      }
    });

    return items;

  }
}
