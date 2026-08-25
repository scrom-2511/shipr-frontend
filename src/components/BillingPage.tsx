import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Loading } from "./ui/Loading";
import { GitHubIcon } from "@/src/components/GitHubIcon";
import { getBillingDetailsHandler, type BillingDetails } from "../reqHandlers/billing/getBillingDetails.reqhandler";

import { BillingHeader } from "./billing/BillingHeader";
import { BillingStatsGrid } from "./billing/BillingStatsGrid";
import { PricingStandards } from "./billing/PricingStandards";
import { ProjectsUsageTable } from "./billing/ProjectsUsageTable";
import { SavedPaymentAndAutoReload } from "./billing/SavedPaymentAndAutoReload";
import { InvoiceHistoryTable } from "./billing/InvoiceHistoryTable";
import { AddCreditsModal } from "./billing/AddCreditsModal";

export function BillingPage() {
  const [showAddCreditsModal, setShowAddCreditsModal] = useState(false);

  const { data: billingData, isLoading, error } = useQuery<BillingDetails>({
    queryKey: ["billing"],
    queryFn: getBillingDetailsHandler,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <Loading title="Loading billing overview..." />
      </div>
    );
  }

  if (error || !billingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white font-mono">
        <p className="text-red-400">Failed to load billing information. Please try refreshing.</p>
      </div>
    );
  }

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
          <BillingHeader
            hourlyRate={billingData.hourly_rate}
            onOpenAddCredits={() => setShowAddCreditsModal(true)}
          />

          {/* Stats Overview Grid */}
          <BillingStatsGrid billingData={billingData} />

          {/* Pricing Standard & Transparency Section */}
          <PricingStandards />

          {/* Active Projects Usage Breakdown */}
          <ProjectsUsageTable projects={billingData.projects} />

          {/* Payment Method & Auto Top-Up Grid */}
          {/* <SavedPaymentAndAutoReload
            paymentMethod={billingData.payment_method}
            onOpenAddCredits={() => setShowAddCreditsModal(true)}
          /> */}

          {/* Invoices & History Table */}
          {/* <InvoiceHistoryTable invoices={billingData.invoices} /> */}
        </div>
      </main>

      {/* Add Credits & Payment Details Modal */}
      {showAddCreditsModal && (
        <AddCreditsModal onClose={() => setShowAddCreditsModal(false)} />
      )}
    </div>
  );
}
