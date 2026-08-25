import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, DollarSign, XCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { GitHubIcon } from "@/src/components/GitHubIcon";
import { useQuery } from "@tanstack/react-query";
import { getPaymentConfirmationHandler } from "../reqHandlers/billing/paymentConfirmation.reqhandler";

export function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const payment_id = searchParams.get("payment_id");

  const confirmPayment = useQuery({
    queryKey: ["payment", payment_id],
    queryFn: () => getPaymentConfirmationHandler(payment_id!),
    enabled: Boolean(payment_id),
    retry: 2,
  });

  const isLoading = confirmPayment.isPending;
  const isFailed = !payment_id || confirmPayment.isError || (confirmPayment.data && !confirmPayment.data.confirmed);
  const errorMessage = !payment_id
    ? "No payment reference ID was found in the checkout URL."
    : confirmPayment.error instanceof Error
    ? confirmPayment.error.message
    : "Payment confirmation failed or transaction was not completed.";

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-mono">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="font-mono text-lg font-medium tracking-tight text-white">shipr</span>
          </Link>

          <div className="flex items-center gap-6 text-sm">
            <Link to="/dashboard" className="text-neutral-500 hover:text-white transition-colors">
              projects
            </Link>
            <Link to="/billing" className="text-neutral-500 hover:text-white transition-colors">
              billing
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <GitHubIcon className="size-4" />
              <span>scrom</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex min-h-screen items-center justify-center pt-20 pb-16 px-6">
        <div className="w-full max-w-lg space-y-8 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-8 sm:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Top Decorative Line */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
              isLoading
                ? "from-amber-500 via-yellow-400 to-amber-600"
                : isFailed
                ? "from-red-500 via-rose-400 to-red-600"
                : "from-emerald-500 via-teal-400 to-emerald-600"
            }`}
          />

          {isLoading ? (
            /* Loading State */
            <div className="text-center space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-950/80 border border-amber-800 text-amber-400">
                <Loader2 className="size-9 animate-spin" />
              </div>

              <div>
                <p className="text-xs text-amber-400 uppercase tracking-widest">// verifying payment</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  Confirming Payment...
                </h1>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  Please wait while we verify your transaction status with Dodo Payments.
                </p>
              </div>
            </div>
          ) : isFailed ? (
            /* Failed State */
            <div className="text-center space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-950/80 border border-red-800 text-red-400">
                <XCircle className="size-9" />
              </div>

              <div>
                <p className="text-xs text-red-400 uppercase tracking-widest">// payment failed</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  Payment Verification Failed
                </h1>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
          ) : (
            /* Success State */
            <div className="text-center space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 animate-pulse">
                <CheckCircle2 className="size-9" />
              </div>

              <div>
                <p className="text-xs text-emerald-400 uppercase tracking-widest">// payment completed</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  Payment Successful!
                </h1>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  Thank you for your payment. Your compute credits have been updated and are now ready to power your MicroVM workloads.
                </p>
              </div>
            </div>
          )}

          {/* Details Card */}
          <div className="rounded-xl border border-neutral-900 bg-black/60 p-5 space-y-3.5 text-xs text-neutral-300">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
              <span className="text-neutral-500">Status</span>
              <span
                className={`inline-flex items-center gap-1.5 font-medium ${
                  isLoading
                    ? "text-amber-400"
                    : isFailed
                    ? "text-red-400"
                    : "text-emerald-400"
                }`}
              >
                <span
                  className={`size-2 rounded-full ${
                    isLoading
                      ? "bg-amber-400 animate-ping"
                      : isFailed
                      ? "bg-red-400"
                      : "bg-emerald-400"
                  }`}
                />
                {isLoading ? "Processing..." : isFailed ? "Failed / Unconfirmed" : "Completed & Billed"}
              </span>
            </div>

            {payment_id && (
              <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
                <span className="text-neutral-500">Payment ID</span>
                <span className="font-mono text-neutral-300 text-[11px] truncate max-w-[200px]">
                  {payment_id}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
              <span className="text-neutral-500">Provider</span>
              <span className="inline-flex items-center gap-1 text-white">
                <ShieldCheck
                  className={`size-3.5 ${
                    isFailed ? "text-red-400" : isLoading ? "text-amber-400" : "text-emerald-400"
                  }`}
                />{" "}
                Dodo Payments Secure Checkout
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-neutral-500">Service</span>
              <span className="text-neutral-300">Shipr MicroVM Serverless Compute</span>
            </div>
          </div>

          {/* Feature Highlights (only shown on success) */}
          {!isFailed && !isLoading && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg border border-neutral-900 bg-neutral-900/30 p-3 text-center space-y-1">
                <Zap className="size-4 text-amber-400 mx-auto" />
                <div className="text-[11px] font-medium text-white">Instant Provisioning</div>
                <div className="text-[10px] text-neutral-500">Zero wait time</div>
              </div>
              <div className="rounded-lg border border-neutral-900 bg-neutral-900/30 p-3 text-center space-y-1">
                <DollarSign className="size-4 text-emerald-400 mx-auto" />
                <div className="text-[11px] font-medium text-white">Per-Second Metering</div>
                <div className="text-[10px] text-neutral-500">Never lose unused time</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            {isFailed ? (
              <>
                {payment_id && (
                  <Button
                    onClick={() => confirmPayment.refetch()}
                    className="w-full bg-red-600 hover:bg-red-500 text-white transition-all font-mono text-sm py-5 cursor-pointer"
                  >
                    <RotateCcw className="size-4 mr-2" />
                    Retry Verification
                  </Button>
                )}
                <Link to="/billing" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-neutral-800 text-neutral-300 hover:bg-neutral-900 font-mono text-sm py-5 cursor-pointer"
                  >
                    Return to Billing
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/billing" className="w-full">
                  <Button className="w-full bg-white text-black hover:bg-neutral-200 transition-all font-mono text-sm py-5 cursor-pointer">
                    View Billing Overview
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/dashboard" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full border-neutral-800 text-neutral-300 hover:bg-neutral-900 font-mono text-sm py-5 cursor-pointer"
                  >
                    Back to Projects
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

