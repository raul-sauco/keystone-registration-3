/**
 * Credentials model
 */
export class Credentials {
  userName: string;
  accessToken: string;
  type: number;
  studentId?: number;

  constructor(cred: {
    userName: string;
    accessToken: string;
    type: number;
    studentId?: number;
  }) {
    this.userName = cred.userName.trim();
    this.accessToken = cred.accessToken.trim();
    this.type = cred.type;
    this.studentId = cred.studentId;
  }
}
