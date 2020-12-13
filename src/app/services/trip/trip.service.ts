import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  id: number;
  name: string;
  code: string;
  type: string;

  constructor() {}

  /**
   * Init the providers values with a server's response
   * data = {
   *   code: code,
   *   error: false,
   *   type: 'student' | 'teacher'
   *   id: 143,
   *   name: 'Hogwarts school of witchcraft...'
   * }
   * @param data whether the values could be used to set
   * the provider
   */
  setCodeValues(data: any): boolean {
    this.id = data.id;
    this.name = data.name;
    this.code = data.code;
    this.type = data.type;
    // todo check if values can be used
    return true;
  }
}
