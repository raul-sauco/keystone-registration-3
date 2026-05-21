export interface CredentialsJson {
  username: string;
  type: number;
  studentId: number;
}

export enum UserType {
  Teacher = 4,
  Student = 6,
}

/**
 * Credentials model.
 */
export class Credentials {
  readonly username: string;
  readonly type: number;
  readonly studentId: number;

  constructor(json: CredentialsJson) {
    this.username = json.username.trim();
    this.type = json.type;
    this.studentId = json.studentId;
  }
}
