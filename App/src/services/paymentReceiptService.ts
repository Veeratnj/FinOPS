import { ApiService } from "./apiService";

export interface PaymentReceipt {
  id: string;
  vendor: string;
  amount_usd: number;
  currency: string;
  payment_date: string;
  status: string;
  invoice_number: string;
  description: string;
  category: string;
  download_url: string;
}

class PaymentReceiptService extends ApiService {

  async getReceipts() {
    return this.get<PaymentReceipt[]>(
      "/payment-receipts"
    );
  }

  downloadReceipt(
    receiptId: string
  ) {
    return `http://localhost:8001/payment-receipts/${receiptId}/download`;
  }
}

export const paymentReceiptService =
  new PaymentReceiptService();