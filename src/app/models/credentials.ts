/**
 * Credentials model
 */
export class Credentials {
  userName: string;
  accessToken: string;

  /** User type 6 for students and 4 for teachers */
  type: number;
  studentId: number;

  constructor(cred: any) {
    this.userName     = cred.userName.trim();
    this.accessToken  = cred.accessToken.trim();
    this.type         = cred.type;
    this.studentId    = cred.studentId;
  }
}
