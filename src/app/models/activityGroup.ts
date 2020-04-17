import { Event } from './event';

/**
 * ActivityGroup data model.
 * It contains an array of the Events in this
 * activity group's itinerary.
 */
export class ActivityGroup {
  id: number;
  name?: string;
  tripId: number;

  /** The events in this activity group's itinerary */
  private events: Event[];
  private formattedItinerary: any;

  /**
   * Create an activiy group given its data as a JSON object.
   * @param ag JSON Activity Group data
   */
  constructor(ag: any) {
    this.id = ag.id;
    this.name = ag.name;
    this.tripId = ag.trip_id;
    this.formattedItinerary = {};
  }

  /**
   * FormattedItinerary property getter
   */
  getFormattedItinerary(itineraryDate?: string): any {
    if (!itineraryDate) {
      return this.formattedItinerary;
    }
    return this.formattedItinerary[itineraryDate];
  }

  /**
   * Get the dates that are used as keys on the formatted itinerary
   * in order.
   */
  getOrderedItineraryDates(): string[] {
    return Object.keys(this.formattedItinerary)
      .sort((a: string, b: string) => a.localeCompare(b));
  }

  /**
   * events property setter
   * @param Event[] events
   */
  setEvents(events: Event[]): void {
    this.events = events;
    this.generateFormattedItinerary();
  }

  /**
   * Constructs an ordered instance of the itinerary that the views can
   * use easily. It takes the form:
   *
   *    {
   *      '2018-11-25': {
   *                      'id': 25,
   *                      'name': 'Climbing at Linan'
   *                      ...
   *                    },
   *                    {...}
   *                    },
   *      '2018-11-26': {...}
   *    }
   */
  generateFormattedItinerary() {

    // Empty the class property, do not add to existing
    this.formattedItinerary = {};

    // Iterate over all events
    this.events.forEach(event => {

      // If the object key for the event date does not exist, add it
      if (!this.formattedItinerary.hasOwnProperty(event.date)) {
        this.formattedItinerary[event.date] = [];
      }

      this.formattedItinerary[event.date].push(event);

    });

    // All the events are in the object, sort them
    this.sortEventsPerDate();

  }

  /**
   * Sort all the events in each date per startTime
   */
  sortEventsPerDate(): void {

    // Go over all the dates and sort the events in them.
    Object.keys(this.formattedItinerary).forEach( d => {

      this.formattedItinerary[d].sort(
        (a: Event, b: Event) => a.startTime.localeCompare(b.startTime));
    });

  }

}
