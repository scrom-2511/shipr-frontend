import { Plus } from "lucide-react";
import { Button } from "../ui/button";

interface BillingHeaderProps {
  hourlyRate: number;
  onOpenAddCredits: () => void;
}

export function BillingHeader({ hourlyRate, onOpenAddCredits }: BillingHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-900 pb-6">
      <div>
        <p className="font-mono text-xs text-neutral-500">// billing & usage overview</p>
        <h1 className="mt-2 font-mono text-3xl font-medium tracking-tight">
          Billing & Usage
        </h1>
        <p className="mt-2 font-mono text-sm text-neutral-400">
          Serverless compute charged per active hour at{" "}
          <span className="text-white font-medium">${hourlyRate.toFixed(4)}/hr</span>
        </p>
      </div>
      <Button
        variant="outline"
        size="default"
        className="border-neutral-700 font-mono text-sm hover:bg-white hover:text-black transition-colors"
        onClick={onOpenAddCredits}
      >
        <Plus className="size-4 mr-1.5" />
        Add Credits
      </Button>
    </div>
  );
}
