import { Zap } from "lucide-react";

interface SavedPaymentAndAutoReloadProps {
  auto_topup_enabled: boolean;
}

export function SavedPaymentAndAutoReload({
  auto_topup_enabled,
}: SavedPaymentAndAutoReloadProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Saved Payment Method */}
      {/* <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider">
            // Saved Payment Method
          </p>
          <CreditCard className="size-4 text-neutral-400" />
        </div>
        {paymentMethod ? (
          <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-14 items-center justify-center rounded border border-neutral-700 bg-neutral-800 font-mono text-xs font-bold text-white tracking-wider">
                {paymentMethod.card_brand.toUpperCase()}
              </div>
              <div>
                <p className="font-mono text-sm font-medium">
                  {paymentMethod.card_brand.toLowerCase() === "upi"
                    ? `UPI Handle •••• ${paymentMethod.last4}`
                    : `•••• •••• •••• ${paymentMethod.last4}`}
                </p>
                <p className="font-mono text-xs text-neutral-500">
                  {paymentMethod.card_brand.toLowerCase() === "upi"
                    ? "Instant Virtual Payment Address"
                    : `Expires ${paymentMethod.exp_month}/${paymentMethod.exp_year}`}
                </p>
              </div>
            </div>
            <span className="rounded bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-400 font-semibold">
              Default
            </span>
          </div>
        ) : (
          <p className="font-mono text-xs text-neutral-500">No payment method added yet.</p>
        )}
        <Button
          variant="outline"
          className="w-full border-neutral-800 font-mono text-xs hover:bg-neutral-900 transition-colors"
          onClick={onOpenAddCredits}
        >
          Add or Update Payment Method
        </Button>
      </div> */}

      {/* Auto Top-Up */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider">// Auto Top-Up</p>
          <Zap className="size-4 text-yellow-400" />
        </div>
        <p className="font-mono text-xs text-neutral-400 leading-relaxed">
          Automatically recharge your credit balance by $50.00 whenever balance drops below $10.00 to prevent microVM execution interruptions.
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
          <span className="font-mono text-xs text-neutral-500">Status</span>
          <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            {auto_topup_enabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
}
