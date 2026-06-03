import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { AIToolShell } from "@/components/ai-tool-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { runAI } from "@/lib/ai.functions";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Aria" },
      { name: "description", content: "Get structured briefings on any topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(runAI);
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("Standard brief");
  const [audience, setAudience] = useState("Executive team");
  const [output, setOutput] = useState("");

  const mut = useMutation({
    mutationFn: async () => {
      const system =
        "You are a senior research analyst. Produce a structured, balanced briefing. Be specific. Output Markdown only. If you are uncertain, say so.";
      const user = `Topic: ${topic}
Depth: ${depth}
Audience: ${audience}

Output structure:
## Executive Summary
(3-5 sentences)

## Background

## Key Points
- ...

## Pros & Cons / Tradeoffs
**Pros**
- ...
**Cons**
- ...

## Recommended Next Steps
- ...

## Caveats & Things to Verify
- ...`;
      const res = await run({ data: { system, user } });
      return res.content;
    },
    onSuccess: (t) => setOutput(t),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AIToolShell
      eyebrow="AI Research Assistant"
      title="Briefings on any topic, structured for action"
      description="Tell Aria the topic, depth, and audience. You get an executive-ready briefing."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-2">
            <Label htmlFor="topic">Topic / question</Label>
            <Input
              id="topic"
              placeholder="e.g. Trends in AI customer support 2026"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Quick overview", "Standard brief", "Deep dive"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Executive team", "Engineering", "Marketing", "Sales", "General"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button
            onClick={() => mut.mutate()}
            disabled={!topic || mut.isPending}
            className="w-full gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {mut.isPending ? "Researching…" : "Generate briefing"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Note: Research is based on the model's training knowledge and may be out of date.
            Verify facts and figures before citing.
          </p>
        </div>

        <AIOutput
          value={output}
          onChange={setOutput}
          isLoading={mut.isPending}
          onRegenerate={() => mut.mutate()}
          minHeight="min-h-[420px]"
          placeholder="Your briefing will appear here. Edit freely."
        />
      </div>
    </AIToolShell>
  );
}