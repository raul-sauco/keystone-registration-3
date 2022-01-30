import { PaymentInfo } from './paymentInfo';

/**
 * Credentials model.
 */
export class Credentials {
  userName: string;
  accessToken: string;
  type: number;
  studentId?: number;
  paymentInfo: PaymentInfo | null;

  constructor(cred: {
    userName: string;
    accessToken: string;
    type: number;
    studentId?: number;
    paymentInfo?: {
      required: boolean;
      termsAccepted: boolean;
      paid: boolean;
      paidDate?: string;
    };
  }) {
    this.userName = cred.userName.trim();
    this.accessToken = cred.accessToken.trim();
    this.type = cred.type;
    this.studentId = cred.studentId;
    this.paymentInfo = cred.paymentInfo
      ? new PaymentInfo(cred.paymentInfo)
      : null;
  }
}
