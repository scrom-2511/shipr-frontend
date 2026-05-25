import { Loader2 } from "lucide-react";

interface LoadingProps {
  title?: string;
  className?: string;
}

export function Loading({ title = "loading...", className }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-neutral-500 ${className}`}>
      <Loader2 className="size-6 animate-spin mb-4 text-white/50" />
      <p className="font-mono text-sm leading-relaxed tracking-tight select-none">
        // {title.toLowerCase()}
      </p>
    </div>
  );
}
