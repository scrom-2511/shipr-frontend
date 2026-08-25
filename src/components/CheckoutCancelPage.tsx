import { Link } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import { Button } from "./ui/button";
import { GitHubIcon } from "@/src/components/GitHubIcon";

export function CheckoutCancelPage() {
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
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-600" />

          <div className="text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-red-950/60 border border-red-900/80 text-red-400">
              <XCircle className="size-9" />
            </div>

            <div>
              <p className="text-xs text-red-400 uppercase tracking-widest">// checkout cancelled</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                Payment Cancelled
              </h1>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Your Dodo Payments checkout session was cancelled. No charges were made to your account.
              </p>
            </div>
          </div>

          {/* Info Card */}
          <div className="rounded-xl border border-neutral-900 bg-black/60 p-5 space-y-3 text-xs text-neutral-300">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
              <span className="text-neutral-500">Status</span>
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="size-2 rounded-full bg-amber-400" />
                Cancelled by User
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-neutral-900 pb-2.5">
              <span className="text-neutral-500">Account Balance</span>
              <span className="text-neutral-300 font-medium">Unchanged</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-neutral-500">Need Help?</span>
              <span className="text-neutral-400 flex items-center gap-1">
                <HelpCircle className="size-3.5" /> Support Available
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link to="/billing" className="w-full">
              <Button className="w-full bg-white text-black hover:bg-neutral-200 transition-all font-mono text-sm py-5">
                <RefreshCw className="size-4 mr-2" />
                Try Checkout Again
              </Button>
            </Link>
            <Link to="/dashboard" className="w-full">
              <Button variant="outline" className="w-full border-neutral-800 text-neutral-300 hover:bg-neutral-900 font-mono text-sm py-5">
                <ArrowLeft className="size-4 mr-2" />
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
