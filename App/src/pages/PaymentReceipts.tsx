import { useState } from "react";
import { useFinOpsData } from "@/hooks/useFinOpsData";
import { PageSkeleton } from "@/components/ui/Skeletons";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Download, Eye, Receipt } from "lucide-react";
import {
  paymentReceiptService
} from "@/services/paymentReceiptService";

import {
  useEffect
} from "react";

export default function PaymentReceipts() {

  const { data, loading } = useFinOpsData();

  const [selectedReceipt, setSelectedReceipt] =
    useState(null);

  const [receipts, setReceipts] =
    useState([]);

  useEffect(() => {

    const loadReceipts = async () => {

      try {

        const response =
          await paymentReceiptService
            .getReceipts();

        console.log(
          "Receipts Response:",
          response
        );

        setReceipts(response);

      } catch (error) {

        console.error(
          "Failed to load receipts",
          error
        );
      }
    };

    loadReceipts();

  }, []);

  if (loading || !data) {
    return <PageSkeleton />;
  }

  const handleViewReceipt = (receipt) => {
    setSelectedReceipt(receipt);
  };

  const handleDownloadReceipt = (
    receipt
  ) => {

    window.open(
      paymentReceiptService
        .downloadReceipt(
          receipt.id
        ),
      "_blank"
    );
  };

  const statusVariant = (status) =>
    status === "Paid"
      ? "success"
      : "warning";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Receipt className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Payment Receipts</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Total receipts: {receipts.length}
        </div>
      </div>

      <div className="finops-card p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm font-medium text-muted-foreground">
                <th className="pb-3">Date</th>
                <th className="pb-3">Vendor</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Invoice #</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="text-sm">
                  <td className="py-4">{new Date(receipt.date).toLocaleDateString()}</td>
                  <td className="py-4 font-medium">{receipt.vendor}</td>
                  <td className="py-4 font-mono">{formatCurrency(receipt.amount)}</td>
                  <td className="py-4">
                    <StatusBadge status={receipt.status} variant={statusVariant(receipt.status)} />
                  </td>
                  <td className="py-4 text-muted-foreground">{receipt.invoiceNumber}</td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewReceipt(receipt)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        title="View Receipt"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownloadReceipt(receipt)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        title="Download Receipt"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Detail Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setSelectedReceipt(null)}>
          <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Receipt Details</h2>
              <button onClick={() => setSelectedReceipt(null)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>
            <div className="space-y-3">
              <div><span className="font-medium">Date:</span> {new Date(selectedReceipt.date).toLocaleDateString()}</div>
              <div><span className="font-medium">Vendor:</span> {selectedReceipt.vendor}</div>
              <div><span className="font-medium">Amount:</span> {formatCurrency(selectedReceipt.amount)}</div>
              <div><span className="font-medium">Status:</span> <StatusBadge status={selectedReceipt.status} variant={statusVariant(selectedReceipt.status)} /></div>
              <div><span className="font-medium">Invoice #:</span> {selectedReceipt.invoiceNumber}</div>
              <div><span className="font-medium">Description:</span> {selectedReceipt.description}</div>
            </div>
            <div className="mt-6 flex gap-2">
              <button onClick={() => handleDownloadReceipt(selectedReceipt)} className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Download PDF
              </button>
              <button onClick={() => setSelectedReceipt(null)} className="flex-1 rounded-lg bg-accent py-2 text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}