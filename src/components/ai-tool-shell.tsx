import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function AIToolShell({ eyebrow, title, description, children }: Props) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6 md:p-10">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
      </div>
      {children}
      <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          <span className="font-medium text-foreground">Responsible AI:</span> Outputs are generated
          by AI and may contain errors, bias, or sensitive information. Review and edit before
          sharing externally. Avoid entering confidential data.
        </p>
      </div>
    </div>
  );
}