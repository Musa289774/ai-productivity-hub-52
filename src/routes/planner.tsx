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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { runAI } from "@/lib/ai.functions";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Aria" },
      { name: "description", content: "Break goals into prioritized, time-boxed tasks." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(runAI);
  const [goal, setGoal] = useState("");
  const [horizon, setHorizon] = useState("This week");
  const [hours, setHours] = useState("4");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");

  const mut = useMutation({
    mutationFn: async () => {
      const system =
        "You are a productivity coach. Produce a realistic, prioritized task plan. Output Markdown only.";
      const user = `Goal: ${goal}
Time horizon: ${horizon}
Available focus time per day: ${hours} hours
Context / constraints: ${context || "None"}

Output structure:
## Plan Overview
(2-3 sentences)

## Prioritized Tasks
| # | Task | Priority | Est. time | Day |
|---|------|----------|-----------|-----|

## Suggested Daily Schedule
- Day 1: ...
- Day 2: ...

## Risks & Watchouts
- ...`;
      const res = await run({ data: { system, user } });
      return res.content;
    },
    onSuccess: (t) => setOutput(t),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AIToolShell
      eyebrow="AI Task Planner"
      title="Turn goals into a clear plan"
      description="Describe the goal and time you have. Aria builds a prioritized, time-boxed plan."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-2">
            <Label htmlFor="g">Goal</Label>
            <Input
              id="g"
              placeholder="e.g. Launch the new landing page"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Time horizon</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Today", "This week", "Next 2 weeks", "This month", "This quarter"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="h">Hours/day</Label>
              <Input
                id="h"
                type="number"
                min={1}
                max={12}
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="c">Constraints / context</Label>
            <Textarea
              id="c"
              rows={6}
              placeholder="e.g. Designer is OOO Wednesday. Need legal review before launch."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <Button
            onClick={() => mut.mutate()}
            disabled={!goal || mut.isPending}
            className="w-full gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {mut.isPending ? "Planning…" : "Build my plan"}
          </Button>
        </div>

        <AIOutput
          value={output}
          onChange={setOutput}
          isLoading={mut.isPending}
          onRegenerate={() => mut.mutate()}
          placeholder="Your task plan will appear here. Edit freely."
        />
      </div>
    </AIToolShell>
  );
}