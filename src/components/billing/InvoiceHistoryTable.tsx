import { CheckCircle2, Download } from "lucide-react";
import { type BillingInvoice } from "@/src/reqHandlers/billing/getBillingDetails.reqhandler";
import { convertUTCToLocal } from "@/src/utils/utcToLocal";

interface InvoiceHistoryTableProps {
  invoices: BillingInvoice[];
}

export function InvoiceHistoryTable({ invoices }: InvoiceHistoryTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs text-neutral-500">// invoice history</p>
          <h2 className="font-mono text-xl font-medium">Billing Receipts & Invoices</h2>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950">
        <table className="w-full text-left font-mono text-sm">
          <thead className="border-b border-neutral-800 bg-neutral-900/40 text-xs text-neutral-400 uppercase">
            <tr>
              <th className="py-3.5 px-6 font-medium">Invoice #</th>
              <th className="py-3.5 px-6 font-medium">Date</th>
              <th className="py-3.5 px-6 font-medium">Type / Details</th>
              <th className="py-3.5 px-6 font-medium">Amount</th>
              <th className="py-3.5 px-6 font-medium">Status</th>
              <th className="py-3.5 px-6 font-medium text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900 text-neutral-300">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-neutral-500">
                  No billing invoices generated yet.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-neutral-900/30 transition-colors">
                  <td className="py-4 px-6 font-medium text-white">{inv.invoice_number}</td>
                  <td className="py-4 px-6 text-neutral-400">
                    {inv.created_at ? convertUTCToLocal(inv.created_at) : "Recent"}
                  </td>
                  <td className="py-4 px-6 text-neutral-400">
                    {inv.active_hours > 0 ? `${inv.active_hours.toFixed(1)} hrs Compute` : "Compute Credit Top-Up"}
                  </td>
                  <td className="py-4 px-6 font-medium text-white">${inv.amount.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 uppercase font-semibold">
                      <CheckCircle2 className="size-3" />
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert(`Receipt ${inv.invoice_number} downloaded.`)}
                      className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
                    >
                      <Download className="size-3.5" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
