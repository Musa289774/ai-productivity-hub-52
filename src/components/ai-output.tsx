import { useEffect, useState } from "react";
import { Copy, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onRegenerate?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  minHeight?: string;
}

export function AIOutput({
  value,
  onChange,
  onRegenerate,
  isLoading,
  placeholder = "AI output will appear here. You can edit it freely.",
  minHeight = "min-h-[320px]",
}: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-xs font-medium text-muted-foreground">
            {isLoading ? "Generating…" : "Editable output"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onRegenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              disabled={isLoading}
              className="h-8 gap-1.5 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Regenerate
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={copy}
            disabled={!value}
            className="h-8 gap-1.5 text-xs"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`border-0 bg-transparent ${minHeight} resize-y rounded-none px-4 py-3 font-mono text-sm leading-relaxed shadow-none focus-visible:ring-0`}
      />
    </div>
  );
}