import { Event } from './event';

/**
 * ActivityGroup data model.
 * It contains an array of the Events in this
 * activity group's itinerary.
 */
export class ActivityGroup {
  id: number;
  name: string;
  tripId: number;

  /** The events in this activity group's itinerary */
  events: Event[];

  /**
   * Create an activiy group given its data as a JSON object.
   * @param ag JSON Activity Group data
   */
  constructor(ag: any) {
    this.id = ag.id;
    this.name = ag.name;
    this.tripId = ag.trip_id;
  }
}
