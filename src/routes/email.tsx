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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Aria" },
      { name: "description", content: "Generate clear, on-tone emails in seconds." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(runAI);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");

  const mut = useMutation({
    mutationFn: async () => {
      const system =
        "You are an expert business writing assistant. Produce a complete email with a subject line and body. Output plain text only.";
      const user = `Write an email with these specs:
Recipient/role: ${recipient || "Unspecified"}
Subject hint: ${subject || "Infer from context"}
Tone: ${tone}
Length: ${length}
Context / what to say:
${context}

Format:
Subject: <subject>

<email body with greeting and sign-off>`;
      const res = await run({ data: { system, user } });
      return res.content;
    },
    onSuccess: (text) => setOutput(text),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AIToolShell
      eyebrow="Smart Email Generator"
      title="Draft polished emails in seconds"
      description="Describe what you need to say. Aria writes a complete, on-tone email you can edit and send."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              placeholder="e.g. My manager, Engineering team"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject hint (optional)</Label>
            <Input
              id="subject"
              placeholder="e.g. Project update"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Professional", "Friendly", "Concise", "Persuasive", "Apologetic", "Formal"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Short", "Medium", "Long"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ctx">What do you want to say?</Label>
            <Textarea
              id="ctx"
              placeholder="e.g. Push the launch by one week because QA found two critical bugs..."
              rows={7}
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
          <Button
            onClick={() => mut.mutate()}
            disabled={!context || mut.isPending}
            className="w-full gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {mut.isPending ? "Generating…" : "Generate email"}
          </Button>
        </div>

        <AIOutput
          value={output}
          onChange={setOutput}
          isLoading={mut.isPending}
          onRegenerate={() => mut.mutate()}
          placeholder="Your generated email will appear here. Edit freely before copying."
        />
      </div>
    </AIToolShell>
  );
}