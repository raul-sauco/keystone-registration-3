/**
 * Event model class
 */
export class Event {
  id: number;
  name?: string;
  notes?: string;
  date: string;
  startTime: string;
  endTime?: string;
  activityTypeId?: number;
  activityTypeNameEn?: string;
  activityTypeNameZh?: string;
  activityGroupId: number;

  constructor(event) {
    this.id = event.id;
    this.name = event.name || '';
    this.notes = event.notes || '';
    this.date = event.activity_date;
    this.startTime = event.start_time || '00:00:00';
    this.endTime = event.endTime || null;
    this.activityTypeId = event.activity_type_id || null;
    this.activityTypeNameEn = event.activityTypeNameEn || '';
    this.activityTypeNameZh = event.activityTypeNameZh || '';
    this.activityGroupId = event.activity_group_id;
  }

  /**
   * Do the best to return a "display name" for the event.
   * This method may return null if no data at all is found.
   */
  getName(): string {

    // Return the event's name if found
    if (this.name) {
      return this.name;
    }

    // Try to get an activity type name
    if (this.activityTypeNameEn) {
      return this.activityTypeNameEn;
    }
  }

  /**
   * Notes property getter
   */
  getNotes(): string {
    return this.notes;
  }

  /**
   * Return a formatted representation of the times this event
   * takes place on. The return of this method is safe to use
   * directly in views.
   */
  getFormattedTimes(): string {

    let time = this.formatTime(this.startTime);

    const endTime = this.formatTime(this.endTime);

    if (endTime) {
      time += ` - ${endTime}`;
    }

    return time;
  }

  /**
   * Convert a HH:mm:ss formatted timestring to a HH:mm
   * formatted version.
   *
   * @param time a time in HH:mm:ss format or a null value
   */
  private formatTime(time?: string): string {

    // If the input is null, undefined, '', return null
    if (!time) {
      return null;
    }

    const sections = time.split(':');
    return `${sections[0]}:${sections[1]}`;

  }
}
