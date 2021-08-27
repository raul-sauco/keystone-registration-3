/**
 * Trip model
 */
export class Trip {
  private id: number;
  private name: string;

  constructor(tripJson: any) {
    this.id = tripJson.id;
    this.name = tripJson.name;
  }

  getName(): string {
    return this.name;
  }
}
