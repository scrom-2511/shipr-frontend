import { useState, useEffect } from "react";
import { Zap, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { dodoOnDemandCheckoutHandler } from "@/src/reqHandlers/billing/dodoOnDemandCheckout.reqhandler";

interface SavedPaymentAndAutoReloadProps {
  auto_topup_enabled: boolean;
  userId?: number;
  onToggleAutoTopup?: (enabled: boolean) => void;
}

export function AutoTopUp({
  auto_topup_enabled,
  userId = 1,
  onToggleAutoTopup,
}: SavedPaymentAndAutoReloadProps) {
  const [enabled, setEnabled] = useState(auto_topup_enabled);

  useEffect(() => {
    setEnabled(auto_topup_enabled);
  }, [auto_topup_enabled]);

  const checkoutMutation = useMutation({
    mutationFn: dodoOnDemandCheckoutHandler,
    onSuccess: (data) => {
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    },
    onError: (err: any) => {
      console.error("Auto top-up checkout error:", err);
    },
  });

  const handleEnableClick = () => {
    if (!enabled) {
      checkoutMutation.mutate({ user_id: userId });
    } else {
      const nextState = false;
      setEnabled(nextState);
      onToggleAutoTopup?.(nextState);
    }
  };

  const isPending = checkoutMutation.isPending;

  return (
    <div className="grid gap-6">
      {/* Auto Top-Up */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`size-4 ${enabled ? "text-emerald-400" : "text-neutral-500"}`} />
            <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider">// Auto Top-Up</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleEnableClick}
            className={`font-mono text-xs cursor-pointer transition-all ${enabled
                ? "border-emerald-800/80 bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 hover:border-emerald-700"
                : "border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-white hover:text-black hover:border-white"
              }`}
          >
            {isPending ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="size-3 animate-spin" />
                Connecting...
              </span>
            ) : enabled ? (
              "Enabled"
            ) : (
              "Enable"
            )}
          </Button>
        </div>

        {checkoutMutation.isError && (
          <p className="font-mono text-xs text-red-400">
            {(checkoutMutation.error as Error)?.message || "Failed to start checkout process."}
          </p>
        )}

        <p className="font-mono text-xs text-neutral-400 leading-relaxed">
          Automatically recharge your credit balance by $50.00 whenever balance drops below $10.00 to prevent microVM execution interruptions.
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
          <span className="font-mono text-xs text-neutral-500">Status</span>
          <div className="flex items-center gap-3">
            <span
              className={`font-mono text-xs flex items-center gap-1.5 font-medium ${enabled ? "text-emerald-400" : "text-neutral-500"
                }`}
            >
              <span
                className={`size-2 rounded-full ${enabled ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"
                  }`}
              />
              {enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


