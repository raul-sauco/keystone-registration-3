/**
 * Payment Info model.
 */
export class PaymentInfo {
  required: boolean;
  termsAccepted: boolean;
  paid: boolean;
  paidDate: string | null;

  constructor(json: {
    required?: boolean;
    termsAccepted?: boolean;
    paid?: boolean;
    paidDate?: string;
  }) {
    this.required = json.required ?? false;
    this.termsAccepted = json.termsAccepted ?? false;
    this.paid = json.paid ?? false;
    this.paidDate = json.paidDate ? json.paidDate : null;
  }
}
