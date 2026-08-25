import { useState } from "react";
import {
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dodoCheckoutHandler } from "@/src/reqHandlers/billing/dodoCheckout.reqhandler";

interface AddCreditsModalProps {
  userId?: number;
  onClose: () => void;
}

export function AddCreditsModal({ userId = 1, onClose }: AddCreditsModalProps) {
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(25);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const dodoCheckoutMutation = useMutation({
    mutationFn: dodoCheckoutHandler,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      const targetUrl = data.checkout_url;

      if (targetUrl) {
        setIsRedirecting(true);
        // Redirect directly to Dodo Payments hosted checkout page
        window.location.href = targetUrl;
      } else {
        setErrorMessage("Failed to generate Dodo Payments checkout URL. Please try again.");
      }
    },
    onError: (err: any) => {
      setErrorMessage(err.message || "Failed to create Dodo Payments checkout session.");
    },
  });

  const currentAmount = customAmount ? parseFloat(customAmount) : (selectedPreset || 25);

  const handleProceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentAmount || isNaN(currentAmount) || currentAmount < 1) {
      setErrorMessage("Please enter a valid payment amount ($1 minimum).");
      return;
    }

    dodoCheckoutMutation.mutate({
      amount: currentAmount,
      customer_email: undefined,
      return_url: `${window.location.origin}/checkout/success`,
      redirect_url: `${window.location.origin}/checkout/success`,
    });
  };

  const isPending = dodoCheckoutMutation.isPending || isRedirecting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg border border-neutral-800 bg-neutral-950 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl my-8 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-900 pb-4">
          <div>
            <p className="text-xs text-neutral-500">// dodo payments checkout</p>
            <h2 className="text-xl font-medium text-white mt-1">Add Compute Credits</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-neutral-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-900 disabled:opacity-50"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="rounded-xl border border-red-900/80 bg-red-950/60 p-4 text-xs text-red-300 flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="size-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleProceedToCheckout} className="space-y-6">
          {/* Step 1: Select Amount */}
          <div className="space-y-3">
            <label className="block text-xs text-neutral-400 uppercase tracking-wider">
              1. Select Credit Top-Up Amount
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[10, 25, 50, 100].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    setSelectedPreset(amt);
                    setCustomAmount("");
                  }}
                  className={`py-2.5 text-sm rounded-lg border transition-all ${selectedPreset === amt && !customAmount
                    ? "border-white bg-white text-black font-semibold shadow-sm"
                    : "border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-neutral-700"
                    }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <Input
                type="number"
                min="1"
                max="5000"
                disabled={isPending}
                placeholder="Or enter custom amount in USD (e.g. 75)"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedPreset(null);
                }}
                className="border-neutral-800 bg-neutral-900 text-sm focus:border-white focus:ring-0"
              />
            </div>
          </div>

          {/* Dodo Checkout Info Banner */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-300 font-medium flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-400" />
                Hosted by Dodo Payments
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded uppercase font-bold">
                256-Bit SSL Encrypted
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              You will be redirected to the secure Dodo Payments checkout page where you can pay using Cards, UPI.
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-500 font-semibold uppercase">
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">VISA</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">Mastercard</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">UPI</span>
              <span className="px-2 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">NetBanking</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Selected Compute Credits:</span>
              <span className="text-white font-medium">${currentAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Checkout Gateway Fee:</span>
              <span className="text-emerald-400 font-medium">$0.00</span>
            </div>
            <div className="flex justify-between text-sm text-white font-semibold pt-2 border-t border-neutral-800">
              <span>Total Amount to Pay:</span>
              <span>${currentAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-white text-black hover:bg-neutral-200 transition-colors py-3.5 h-auto text-sm font-medium flex items-center justify-center gap-2"
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                <span>{isRedirecting ? "Redirecting to Dodo Checkout..." : "Generating Dodo Session..."}</span>
              </div>
            ) : (
              <>
                <span>Proceed to Dodo Payments Checkout</span>
                <ExternalLink className="size-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

