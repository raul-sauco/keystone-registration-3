import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  id: number;
  name: string;
  code: string;
  type: string;

  constructor() { }

  /**
   * Init the providers values with a server's response
   * response = {
   *   error: false,
   *   type: 'student' | 'teacher'
   *   id: 143,
   *   name: 'Hogwarts school of witchcr...'
   * }
   * @param res whether the values could be used to set
   * the provider
   */
  setCodeValues(res): boolean {
    this.id = res.id;
    this.name = res.name;
    this.code = res.code;
    this.type = res.type;
    // todo check if values can be used
    return true;
  }
}
