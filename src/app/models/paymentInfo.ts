/**
 * Payment Info model.
 */
export class PaymentInfo {
  required: boolean;
  open: boolean;
  termsAccepted: boolean;
  paid: boolean;
  paidDate: string | null;

  constructor(json: {
    required?: boolean;
    open?: boolean;
    termsAccepted?: boolean;
    paid?: boolean;
    paidDate?: string;
  }) {
    this.required = json.required ?? false;
    this.open = json.open ?? false;
    this.termsAccepted = json.termsAccepted ?? false;
    this.paid = json.paid ?? false;
    this.paidDate = json.paidDate ? json.paidDate : null;
  }
}
