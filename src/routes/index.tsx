import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aria — AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate emails, meeting notes, planning, research and Q&A with AI built for professionals." },
      { property: "og:title", content: "Aria — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Automate emails, meeting notes, planning, research and Q&A with AI built for professionals." },
    ],
  }),
  component: Index,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Draft polished, on-brand emails in seconds with tone and intent controls.",
    href: "/email",
    icon: Mail,
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw transcripts into crisp summaries, decisions, and action items.",
    href: "/notes",
    icon: FileText,
  },
  {
    title: "AI Task Planner",
    description: "Break goals into prioritized, time-boxed task lists with owners.",
    href: "/planner",
    icon: ListChecks,
  },
  {
    title: "AI Research Assistant",
    description: "Get structured briefings on any topic with sources, pros and cons.",
    href: "/research",
    icon: Search,
  },
  {
    title: "AI Chatbot",
    description: "An always-on workplace copilot for quick questions and brainstorming.",
    href: "/chat",
    icon: MessageSquare,
  },
];

function Index() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-10 p-6 md:p-10">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 md:p-12 shadow-[var(--shadow-elegant)]">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden
        />
        <div className="relative max-w-2xl text-primary-foreground">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by AI
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
            Your AI workspace,<br />built for focused work.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
            Aria automates the busywork around your day — emails, notes, planning, and research —
            so you can spend more time on the work that matters.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-primary shadow-sm transition hover:bg-white/90"
            >
              Try Email Generator <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              Open Chatbot
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Tools</h2>
            <p className="text-sm text-muted-foreground">Five focused assistants for your workday.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.href}
              to={t.href}
              className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                <t.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
              </div>
              <div className="mt-auto flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-muted/30 p-5 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Responsible AI: </span>
        Aria uses large language models that can make mistakes. Always review outputs before
        sending or acting on them, and avoid sharing confidential or personal information.
      </section>
    </div>
  );
}
