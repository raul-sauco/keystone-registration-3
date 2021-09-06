export class Question {
  question: string;
  answer?: string;
  created_at?: number;
  updated_at?: number;

  constructor(
    question: string,
    answer: string,
    askedTime: number,
    answeredTime: number
  ) {
    this.question = question;
    this.answer = answer;
    this.created_at = askedTime;
    this.updated_at = answeredTime;
  }
}
