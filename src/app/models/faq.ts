/**
 * Frequently Asked Question model class
 */
export class Faq {
  private question: string;
  private answer?: string;
  private createdAt: number;
  private updatedAt: number;

  constructor(faq: any) {
    this.question = faq.question;
    this.answer = faq.answer;
    this.createdAt = faq.created_at || 0;
    this.updatedAt = faq.updated_at || 0;
  }

  getQuestion(): string {
    return this.question;
  }

  getAnswer(): string | null {
    return this.answer || null;
  }

  getCreatedAt(): number {
    return this.createdAt;
  }

  getUpdatedAt(): number {
    return this.updatedAt;
  }
}
