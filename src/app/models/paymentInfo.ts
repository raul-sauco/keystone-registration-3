/**
 * Payment Info model.
 */
export class PaymentInfo {
  required: boolean;
  termsAccepted: boolean;
  paid: boolean;
  paidDate: string | null;

  constructor(json: {
    required: boolean;
    termsAccepted: boolean;
    paid: boolean;
    paidDate?: string;
  }) {
    this.required = json.required;
    this.termsAccepted = json.termsAccepted;
    this.paid = json.paid;
    this.paidDate = json.paidDate ? json.paidDate : null;
  }
}
