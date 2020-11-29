export class ReceiptDataLog {
    constructor(
      public id: string,
      public cost: number | string,
      public comment: string,
      public receiptDate: string,
      public type: string,
      public receiptImages: string[],
      public base64?: string
    ) {}
  }