import { useEffect, useState } from "react";

interface TerminalLine {
  text: string;
  delay: number;
  highlight?: boolean;
  link?: boolean;
}

interface TerminalProps {
  lines?: TerminalLine[];
  className?: string;
}

const defaultLines: TerminalLine[] = [
  { text: "$ ship deploy --project my-app", delay: 0 },
  { text: "", delay: 200 },
  { text: "  Packaging project...", delay: 500 },
  { text: "  Connecting to GitHub...", delay: 900 },
  { text: "  Building production bundle...", delay: 1300 },
  { text: "  Deploying to edge network...", delay: 1700 },
  { text: "", delay: 2100 },
  { text: "  [done] Deployed in 3.2s", delay: 2400, highlight: true },
  { text: "", delay: 2700 },
  { text: "  → https://my-app.shipr.dev", delay: 3000, link: true },
];

export function Terminal({ lines = defaultLines, className = "" }: TerminalProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentLine >= lines.length) return;

    const line = lines[currentLine];
    const prevDelay = lines[currentLine - 1]?.delay || 0;
    const timer = setTimeout(() => {
      setVisibleLines((prev) => [...prev, line.text]);
      setCurrentLine((prev) => prev + 1);
    }, line.delay - prevDelay);

    return () => clearTimeout(timer);
  }, [currentLine, lines]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`border border-neutral-800 bg-black ${className}`}
    >
      {/* Terminal Header */}
      <div className="flex items-center gap-3 border-b border-neutral-800 bg-neutral-950 px-4 py-2">
        <span className="text-xs text-neutral-500">shipr</span>
        <span className="text-neutral-700">—</span>
        <span className="text-xs text-neutral-500 font-mono">bash</span>
      </div>

      {/* Terminal Content */}
      <div className="p-6 font-mono text-sm leading-relaxed">
        {visibleLines.map((line, i) => (
          <div
            key={i}
            className={`${
              line.startsWith("$") ? "text-neutral-300 font-medium" :
              line.startsWith("[done]") ? "text-white" :
              line.startsWith("→") ? "text-neutral-400 underline underline-offset-4" :
              line.includes("...") ? "text-neutral-500" :
              "text-neutral-600"
            }`}
          >
            {line}
          </div>
        ))}
        {currentLine < lines.length && (
          <span className={`text-white ${showCursor ? "opacity-100" : "opacity-0"}`}>
            ▋
          </span>
        )}
      </div>
    </div>
  );
}