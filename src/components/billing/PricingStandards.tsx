import { ShieldCheck } from "lucide-react";

export function PricingStandards() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 sm:p-8 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-xs text-neutral-500">// pricing standards</p>
          <h2 className="mt-2 font-mono text-xl font-medium tracking-tight">
            Serverless MicroVM Pricing Model
          </h2>
          <p className="mt-1 font-mono text-sm text-neutral-400 max-w-2xl leading-relaxed">
            Shipr provisions dedicated Firecracker MicroVMs for isolated deployment execution.
            You only pay for the exact active duration of your running workloads.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 font-mono text-xs text-neutral-300">
          <ShieldCheck className="size-4 text-emerald-400" />
          <span>Per-Second Billing</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 border-t border-neutral-900 pt-6">
        <div className="space-y-1">
          <div className="font-mono text-xs text-neutral-500 uppercase">Hourly Rate</div>
          <div className="font-mono text-lg font-medium text-white">$0.0200 / hr</div>
          <p className="font-mono text-xs text-neutral-500">Standard compute microVM</p>
        </div>
        <div className="space-y-1">
          <div className="font-mono text-xs text-neutral-500 uppercase">Per-Second Rate</div>
          <div className="font-mono text-lg font-medium text-white">$0.00000556 / sec</div>
          <p className="font-mono text-xs text-neutral-500">Granular sub-second metering</p>
        </div>
        <div className="space-y-1">
          <div className="font-mono text-xs text-neutral-500 uppercase">Monthly Free Credits</div>
          <div className="font-mono text-lg font-medium text-emerald-400">$5.00 / mo</div>
          <p className="font-mono text-xs text-neutral-500">Included on all Developer accounts</p>
        </div>
      </div>
    </div>
  );
}
