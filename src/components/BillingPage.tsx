import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Zap,
  Clock,
  DollarSign,
  Plus,
  X,
  CheckCircle2,
  Download,
  HelpCircle,
  ShieldCheck,
  ArrowUpRight,
  Activity,
  Cpu,
  Layers,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loading } from "./ui/Loading";
import { GitHubIcon } from "@/src/components/GitHubIcon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBillingDetailsHandler, type BillingDetails } from "../reqHandlers/billing/getBillingDetails.reqhandler";
import { addCreditsHandler } from "../reqHandlers/billing/addCredits.reqhandler";
import { convertUTCToLocal } from "../utils/utcToLocal";

export function BillingPage() {
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(25);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: billingData, isLoading, error } = useQuery<BillingDetails>({
    queryKey: ["billing"],
    queryFn: getBillingDetailsHandler,
  });

  const addCreditsMutation = useMutation({
    mutationFn: addCreditsHandler,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["billing"] });
      setFeedbackMessage(`Successfully added $${data.added_amount.toFixed(2)} credits!`);
      setTimeout(() => {
        setShowAddCreditsModal(false);
        setFeedbackMessage(null);
      }, 1500);
    },
  });

  const handleAddCreditsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = customAmount ? parseFloat(customAmount) : (selectedPreset || 25);
    if (!amount || isNaN(amount) || amount < 1) return;
    addCreditsMutation.mutate({ amount });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loading title="Loading billing overview..." />
      </div>
    );
  }

  // Fallback state if backend is loading or defaults
  const billing = billingData || {
    plan_name: "Developer Tier",
    hourly_rate: 0.02,
    credit_balance: 50.0,
    total_active_seconds: 174600,
    total_active_hours: 48.5,
    current_month_cost: 0.97,
    estimated_monthly_cost: 14.4,
    projects: [],
    invoices: [],
    payment_method: {
      id: 1,
      card_brand: "Visa",
      last4: "4242",
      exp_month: 12,
      exp_year: 2028,
      is_default: true,
    },
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="font-mono text-lg font-medium tracking-tight">shipr</span>
          </Link>

          <div className="flex items-center gap-6 font-mono text-sm">
            <Link
              to="/dashboard"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              projects
            </Link>
            <Link
              to="/billing"
              className="text-white border-b-2 border-white pb-0.5 font-medium transition-colors"
            >
              billing
            </Link>
            <a href="#" className="text-neutral-500 hover:text-white transition-colors">
              settings
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-sm text-neutral-500">
              <GitHubIcon className="size-4" />
              <span>scrom</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-6 space-y-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-900 pb-6">
            <div>
              <p className="font-mono text-sm text-neutral-500">// billing & usage overview</p>
              <h1 className="mt-2 font-mono text-3xl font-medium tracking-tight">
                Billing & Usage
              </h1>
              <p className="mt-2 font-mono text-sm text-neutral-400">
                Serverless Firecracker microVM compute charged per active hour at{" "}
                <span className="text-white font-medium">${billing.hourly_rate.toFixed(4)}/hr</span>
              </p>
            </div>
            <Button
              variant="outline"
              size="default"
              className="border-neutral-700 font-mono text-sm hover:bg-white hover:text-black transition-colors"
              onClick={() => setShowAddCreditsModal(true)}
            >
              <Plus className="size-4 mr-1.5" />
              Add Credits
            </Button>
          </div>

          {/* Stats Overview Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Credit Balance */}
            <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition-all hover:border-neutral-700">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider">// Credit Balance</span>
                <DollarSign className="size-4 text-emerald-400" />
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-semibold tracking-tight text-white">
                  ${billing.credit_balance.toFixed(2)}
                </span>
                <span className="font-mono text-xs text-emerald-400">Active</span>
              </div>
              <p className="mt-2 font-mono text-xs text-neutral-500">
                Includes $50.00 free monthly tier
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
                  {billing.total_active_hours.toFixed(1)}
                </span>
                <span className="font-mono text-xs text-neutral-400">hours</span>
              </div>
              <p className="mt-2 font-mono text-xs text-neutral-500">
                {billing.total_active_seconds.toLocaleString()} total active seconds
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
                  ${billing.current_month_cost.toFixed(2)}
                </span>
                <span className="font-mono text-xs text-neutral-500">this cycle</span>
              </div>
              <p className="mt-2 font-mono text-xs text-neutral-500">
                Est. ~${billing.estimated_monthly_cost.toFixed(2)}/mo
              </p>
            </div>

            {/* Card 4: Standard Compute Rate */}
            <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-6 transition-all hover:border-neutral-700">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-neutral-500 uppercase tracking-wider">// Compute Rate</span>
                <Cpu className="size-4 text-neutral-400" />
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-semibold tracking-tight text-white">
                  ${billing.hourly_rate.toFixed(2)}
                </span>
                <span className="font-mono text-xs text-neutral-400">/ hour</span>
              </div>
              <p className="mt-2 font-mono text-xs text-neutral-500">
                1 vCPU • 1GB RAM • MicroVM
              </p>
            </div>
          </div>

          {/* Pricing Standard & Transparency Section */}
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
                <div className="font-mono text-lg font-medium text-emerald-400">$50.00 / mo</div>
                <p className="font-mono text-xs text-neutral-500">Included on all Developer accounts</p>
              </div>
            </div>
          </div>

          {/* Active Projects Usage Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-neutral-500">// project breakdown</p>
                <h2 className="font-mono text-xl font-medium">Active Applications Usage</h2>
              </div>
              <span className="font-mono text-xs text-neutral-500">
                {billing.projects.length} projects tracked
              </span>
            </div>

            {billing.projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 py-12 text-center">
                <Layers className="size-8 text-neutral-600 mb-3" />
                <p className="font-mono text-sm text-neutral-400">// no active deployments found</p>
                <p className="font-mono text-xs text-neutral-500 mt-1">
                  Deploy a repository to start tracking active serverless compute time.
                </p>
                <Link
                  to="/dashboard"
                  className="mt-4 inline-flex items-center gap-2 border border-neutral-700 px-4 py-2 font-mono text-xs hover:bg-white hover:text-black transition-colors"
                >
                  go to projects
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950">
                <table className="w-full text-left font-mono text-sm">
                  <thead className="border-b border-neutral-800 bg-neutral-900/40 text-xs text-neutral-400 uppercase">
                    <tr>
                      <th className="py-3.5 px-6 font-medium">Project</th>
                      <th className="py-3.5 px-6 font-medium">Status</th>
                      <th className="py-3.5 px-6 font-medium">Active Time</th>
                      <th className="py-3.5 px-6 font-medium">Rate</th>
                      <th className="py-3.5 px-6 font-medium text-right">Current Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900 text-neutral-300">
                    {billing.projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-neutral-900/30 transition-colors">
                        <td className="py-4 px-6">
                          <Link
                            to={`/projects/${proj.id}`}
                            className="font-medium text-white hover:underline flex items-center gap-2"
                          >
                            {proj.project_id}
                            <ArrowUpRight className="size-3 text-neutral-500" />
                          </Link>
                          <div className="text-xs text-neutral-500 mt-0.5">{proj.full_name}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span
                              className={`size-2 rounded-full ${
                                proj.status === "active"
                                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                                  : proj.status === "building"
                                  ? "bg-yellow-400"
                                  : "bg-red-500"
                              }`}
                            />
                            <span className="text-xs uppercase text-neutral-400">{proj.status}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div>{proj.active_hours.toFixed(1)} hrs</div>
                          <div className="text-xs text-neutral-500">
                            ({proj.active_seconds.toLocaleString()}s)
                          </div>
                        </td>
                        <td className="py-4 px-6 text-neutral-400">${proj.hourly_rate.toFixed(4)}/hr</td>
                        <td className="py-4 px-6 text-right font-medium text-white">
                          ${proj.cost.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment Method & Automatic Refill */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider">// Payment Method</p>
                <CreditCard className="size-4 text-neutral-400" />
              </div>
              {billing.payment_method ? (
                <div className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-12 items-center justify-center rounded border border-neutral-700 bg-neutral-800 font-mono text-xs font-bold text-white">
                      {billing.payment_method.card_brand.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium">•••• •••• •••• {billing.payment_method.last4}</p>
                      <p className="font-mono text-xs text-neutral-500">
                        Expires {billing.payment_method.exp_month}/{billing.payment_method.exp_year}
                      </p>
                    </div>
                  </div>
                  <span className="rounded bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 font-mono text-[10px] uppercase text-emerald-400">
                    Default
                  </span>
                </div>
              ) : (
                <p className="font-mono text-xs text-neutral-500">No payment method added yet.</p>
              )}
              <Button
                variant="outline"
                className="w-full border-neutral-800 font-mono text-xs hover:bg-neutral-900"
                onClick={() => setShowAddCreditsModal(true)}
              >
                Update Payment Details
              </Button>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-neutral-500 uppercase tracking-wider">// Auto Top-Up</p>
                <Zap className="size-4 text-yellow-400" />
              </div>
              <p className="font-mono text-xs text-neutral-400 leading-relaxed">
                Automatically recharge your credit balance by $25.00 whenever balance drops below $5.00 to prevent microVM interruption.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-900">
                <span className="font-mono text-xs text-neutral-500">Status</span>
                <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                  Enabled
                </span>
              </div>
            </div>
          </div>

          {/* Invoices & History Table */}
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
                    <th className="py-3.5 px-6 font-medium">Runtime Hours</th>
                    <th className="py-3.5 px-6 font-medium">Amount</th>
                    <th className="py-3.5 px-6 font-medium">Status</th>
                    <th className="py-3.5 px-6 font-medium text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 text-neutral-300">
                  {billing.invoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-neutral-500">
                        No billing invoices generated yet.
                      </td>
                    </tr>
                  ) : (
                    billing.invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-neutral-900/30 transition-colors">
                        <td className="py-4 px-6 font-medium text-white">{inv.invoice_number}</td>
                        <td className="py-4 px-6 text-neutral-400">
                          {inv.created_at ? convertUTCToLocal(inv.created_at) : "Recent"}
                        </td>
                        <td className="py-4 px-6 text-neutral-400">
                          {inv.active_hours > 0 ? `${inv.active_hours.toFixed(1)} hrs` : "Credit Top-Up"}
                        </td>
                        <td className="py-4 px-6 font-medium text-white">${inv.amount.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 uppercase">
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
        </div>
      </main>

      {/* Add Credits Modal */}
      {showAddCreditsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-md border border-neutral-800 bg-black p-8 rounded-xl space-y-6">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-neutral-500">// top-up balance</p>
              <button
                onClick={() => setShowAddCreditsModal(false)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div>
              <h2 className="font-mono text-xl font-medium">Add Compute Credits</h2>
              <p className="mt-1 font-mono text-xs text-neutral-400">
                Credits never expire and are automatically applied to your hourly microVM usage.
              </p>
            </div>

            {feedbackMessage && (
              <div className="rounded-lg border border-emerald-800 bg-emerald-950/50 p-3 font-mono text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="size-4" />
                {feedbackMessage}
              </div>
            )}

            <form onSubmit={handleAddCreditsSubmit} className="space-y-6">
              {/* Preset Amounts */}
              <div className="space-y-2">
                <label className="block font-mono text-xs text-neutral-500 uppercase">
                  Select Amount
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedPreset(amt);
                        setCustomAmount("");
                      }}
                      className={`py-2.5 font-mono text-sm rounded border transition-colors ${
                        selectedPreset === amt && !customAmount
                          ? "border-white bg-white text-black font-semibold"
                          : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input */}
              <div className="space-y-2">
                <label className="block font-mono text-xs text-neutral-500 uppercase">
                  Or Custom Amount ($)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5000"
                  placeholder="Enter amount (e.g. 75)"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedPreset(null);
                  }}
                  className="font-mono"
                />
              </div>

              <div className="rounded-lg border border-neutral-900 bg-neutral-950 p-3 font-mono text-xs text-neutral-500 flex items-center justify-between">
                <span>Payment Source</span>
                <span className="text-neutral-300">Visa •••• 4242</span>
              </div>

              <Button
                type="submit"
                disabled={addCreditsMutation.isPending}
                className="w-full bg-white font-mono text-sm text-black hover:bg-neutral-200"
              >
                {addCreditsMutation.isPending
                  ? "Processing..."
                  : `Add $${customAmount || selectedPreset || 25}.00 Credits`}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
