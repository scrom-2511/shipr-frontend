import { DollarSign, Clock, Activity } from "lucide-react";
import { type BillingDetails } from "@/src/reqHandlers/billing/getBillingDetails.reqhandler";

interface BillingStatsGridProps {
  billingData: BillingDetails;
}

export function BillingStatsGrid({ billingData }: BillingStatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Card 1: Credit Balance */}
      <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition-all hover:border-neutral-700">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider">// Credit Balance</span>
          <DollarSign className="size-4 text-emerald-400" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-semibold tracking-tight text-white">
            ${(billingData.credit_balance / 100).toFixed(2)}
          </span>
          <span className="font-mono text-xs text-emerald-400">Active</span>
        </div>
        <p className="mt-2 font-mono text-xs text-neutral-500">
          Includes $5.00 free monthly tier
        </p>
      </div>

      {/* Card 2: Total Active Hours */}
      <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition-all hover:border-neutral-700">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider">// Active Runtime</span>
          <Clock className="size-4 text-neutral-400" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-semibold tracking-tight text-white">
            {billingData.total_active_hours.toFixed(1)}
          </span>
          <span className="font-mono text-xs text-neutral-400">hours</span>
        </div>
        <p className="mt-2 font-mono text-xs text-neutral-500">
          {billingData.total_active_seconds.toLocaleString()} total active seconds
        </p>
      </div>

      {/* Card 3: Current Month Billed */}
      <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition-all hover:border-neutral-700">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider">// Current Usage</span>
          <Activity className="size-4 text-neutral-400" />
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-semibold tracking-tight text-white">
            ${billingData.current_month_cost.toFixed(2)}
          </span>
          <span className="font-mono text-xs text-neutral-500">this cycle</span>
        </div>
        <p className="mt-2 font-mono text-xs text-neutral-500">
          Est. ~${billingData.estimated_monthly_cost.toFixed(2)}/mo
        </p>
      </div>
    </div>
  );
}
