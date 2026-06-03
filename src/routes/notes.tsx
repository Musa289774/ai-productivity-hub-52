import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { AIToolShell } from "@/components/ai-tool-shell";
import { AIOutput } from "@/components/ai-output";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { runAI } from "@/lib/ai.functions";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Aria" },
      { name: "description", content: "Turn raw meeting notes into structured summaries with action items." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const run = useServerFn(runAI);
  const [transcript, setTranscript] = useState("");
  const [output, setOutput] = useState("");

  const mut = useMutation({
    mutationFn: async () => {
      const system =
        "You are a senior executive assistant. You summarize meeting notes into a clean, scannable structure. Output Markdown only.";
      const user = `Summarize the following meeting notes/transcript. Use this exact structure:

## Summary
(3-5 sentence overview)

## Key Decisions
- ...

## Action Items
- [ ] Owner — Task — Due (if mentioned)

## Open Questions
- ...

Notes:
${transcript}`;
      const res = await run({ data: { system, user } });
      return res.content;
    },
    onSuccess: (t) => setOutput(t),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AIToolShell
      eyebrow="Meeting Notes Summarizer"
      title="From messy notes to crisp summary"
      description="Paste your transcript or rough notes. Aria extracts decisions, action items, and open questions."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-2">
            <Label htmlFor="t">Meeting notes / transcript</Label>
            <Textarea
              id="t"
              rows={16}
              placeholder="Paste raw notes or a transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>
          <Button
            onClick={() => mut.mutate()}
            disabled={!transcript || mut.isPending}
            className="w-full gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {mut.isPending ? "Summarizing…" : "Summarize"}
          </Button>
        </div>

        <AIOutput
          value={output}
          onChange={setOutput}
          isLoading={mut.isPending}
          onRegenerate={() => mut.mutate()}
          minHeight="min-h-[420px]"
          placeholder="Your structured summary will appear here."
        />
      </div>
    </AIToolShell>
  );
}