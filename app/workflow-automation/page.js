import Badge from "../../components/Badge";

const CONTACT_EMAIL = "hello@bphdev.com";
const MAILTO = `mailto:${CONTACT_EMAIL}?subject=Workflow%20Automation%20Sprint`;

export const metadata = {
  title: "Workflow Automation Sprint",
  description:
    "Fixed-scope workflow automation for small businesses: one recurring manual process, one clear deliverable, starting at $500.",
  alternates: { canonical: "/workflow-automation" },
  openGraph: {
    url: "/workflow-automation",
    title: "Workflow Automation Sprint",
    description:
      "Fixed-scope workflow automation for small businesses: one recurring manual process, one clear deliverable, starting at $500.",
  },
  twitter: {
    title: "Workflow Automation Sprint",
    description:
      "Fixed-scope workflow automation for small businesses: one recurring manual process, one clear deliverable, starting at $500.",
  },
};

function Section({ id, eyebrow, title, intro, children, className = "" }) {
  return (
    <section
      id={id}
      className={["scroll-mt-24 space-y-5", className].join(" ")}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Badge>{eyebrow}</Badge>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {intro ? <p className="max-w-3xl text-zinc-400 leading-7">{intro}</p> : null}
      </div>
      {children}
    </section>
  );
}

function Panel({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-3xl border border-zinc-800 bg-zinc-950/40 p-6 sm:p-8",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))]" />
      <div className="relative">{children}</div>
    </div>
  );
}

export default function WorkflowAutomationPage() {
  const fitCards = [
    {
      title: "CSV and report cleanup",
      text: "Export files, clean columns, copy totals -> generate a clean report or dashboard.",
    },
    {
      title: "Spreadsheet handoffs",
      text: "Copy rows between sheets, tabs, or tools -> validate, format, and move the data automatically.",
    },
    {
      title: "Client or lead intake",
      text: "Manually move form submissions into a sheet, inbox, or CRM -> route each submission where it belongs.",
    },
    {
      title: "Invoice and document organization",
      text: "Download, rename, sort, or file documents by hand -> organize files into a consistent structure.",
    },
    {
      title: "Repeated follow-ups",
      text: "Send the same email after the same trigger -> generate a draft, notification, or tracked follow-up.",
    },
    {
      title: "Data reconciliation",
      text: "Compare exports from multiple tools by hand -> produce a mismatch report and clean summary.",
    },
  ];

  const deliverables = [
    {
      title: "Google Sheets automation",
      text: "Custom formulas, Apps Script, buttons, imports, cleanup steps, or formatted outputs inside a sheet your team already uses.",
    },
    {
      title: "CSV or Excel cleanup script",
      text: "A repeatable script that takes messy exports and produces clean files, summaries, or reports.",
    },
    {
      title: "Recurring report generator",
      text: "A workflow that turns raw data into the same weekly or monthly report without rebuilding it by hand.",
    },
    {
      title: "Form-to-spreadsheet workflow",
      text: "An intake flow that routes submissions into a sheet, inbox, CRM, or notification system.",
    },
    {
      title: "Document organization flow",
      text: "A process for naming, sorting, filing, or tracking invoices, receipts, PDFs, or client documents.",
    },
    {
      title: "Small internal dashboard",
      text: "A lightweight view of the numbers, statuses, or exceptions your team needs to check regularly.",
    },
  ];

  const steps = [
    "You send the workflow.",
    "I confirm whether it is a good fit.",
    "We agree on the deliverable, price, and what the finished workflow should do.",
    "I build the first version.",
    "You test it with real examples.",
    "I handle fixes and handoff notes.",
  ];

  return (
    <main className="pb-14">
      <section className="pb-10 pt-6 sm:pb-12 sm:pt-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="text-zinc-200 border-zinc-700">
                  Fixed-scope workflow automation
                </Badge>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl sm:text-6xl font-semibold leading-[1.04] tracking-tight [text-shadow:0_18px_55px_rgba(0,0,0,0.7)]">
                  Turn one manual workflow into a reliable automation.
                </h1>

                <p className="max-w-2xl text-lg text-zinc-400 leading-8 [text-shadow:0_12px_35px_rgba(0,0,0,0.55)]">
                  For small businesses that still copy data between spreadsheets,
                  reports, email, files, or internal tools by hand.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={MAILTO}
                  className="inline-flex min-w-[10.5rem] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/55 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-700"
                >
                  Send a workflow
                </a>
                <a
                  href="#example-deliverables"
                  className="inline-flex min-w-[10.5rem] items-center justify-center rounded-xl border border-zinc-800 bg-transparent px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-zinc-100"
                >
                  See examples
                </a>
              </div>

              <p className="text-sm text-zinc-500">
                Starting at $500 - One workflow - 5-10 business days
              </p>
            </div>

            <GlassCard>
              <div className="space-y-5">
                <p className="text-sm font-medium text-zinc-100">
                  Good fit if you can say:
                </p>

                <ul className="space-y-3 text-sm leading-6 text-zinc-300">
                  <li>"We export this file every week."</li>
                  <li>"We clean this spreadsheet by hand."</li>
                  <li>"We copy this data into another system."</li>
                  <li>"We send the same report repeatedly."</li>
                  <li>"This process works, but wastes time."</li>
                </ul>

                <div className="h-px bg-white/10" />

                <p className="text-sm leading-6 text-zinc-400">
                  Best when the workflow already exists and the goal is to make
                  it faster, cleaner, or more reliable.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section className="space-y-16 sm:space-y-20">
        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/70 to-transparent" />

        <Section
          id="what-is-this-for"
          eyebrow="Common Fits"
          title="Good candidates are repeatable, not complicated."
          intro="The best workflows already happen the same way each week or month. They have a clear input, a manual middle step, and a known output."
          className="pt-2"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {fitCards.map((item) => (
              <Panel key={item.title} className="p-5 sm:p-6">
                <div className="space-y-2">
                  <h3 className="text-base font-medium text-zinc-100">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-zinc-300">{item.text}</p>
                </div>
              </Panel>
            ))}
          </div>

        </Section>

        <Section
          id="example-deliverables"
          eyebrow="Example Deliverables"
          title="What you might get"
          intro="The deliverable depends on the workflow, but the result should be something your team can actually use, rerun, and maintain."
          className="border-t border-zinc-800/60 pt-12 sm:pt-14"
        >
          <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5 sm:p-6">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {deliverables.map((item) => (
                <Panel
                  key={item.title}
                  className="rounded-2xl bg-zinc-950/30 p-4 sm:p-5"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-medium text-zinc-100">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-6 text-zinc-300">{item.text}</p>
                  </div>
                </Panel>
              ))}
            </div>
          </div>

          <p className="max-w-3xl text-zinc-400 leading-7">
            Simple handoff: you get the working tool, a short walkthrough, and
            notes on how to run or maintain it.
          </p>
        </Section>

        <Section
          id="scope-and-pricing"
          eyebrow="Process and pricing"
          title="Simple scope, clear handoff."
          className="border-t border-zinc-800/60 pt-12 sm:pt-14"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] lg:items-start">
            <div className="grid gap-4 md:grid-cols-2">
              {steps.map((step, index) => (
                <Panel key={step} className="p-5">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-widest text-zinc-500">
                      Step {index + 1}
                    </p>
                    <p className="text-sm leading-6 text-zinc-300">{step}</p>
                  </div>
                </Panel>
              ))}
            </div>

            <GlassCard>
              <div className="space-y-5">
                <div>
                  <p className="text-sm uppercase tracking-widest text-zinc-500">
                    Starting price
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
                    $500 fixed-price
                  </p>
                </div>

                <p className="text-zinc-300 leading-7">
                  For one clearly scoped workflow with a defined input, output,
                  and handoff.
                </p>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-zinc-100">Included:</p>
                  <ul className="space-y-2 text-sm leading-6 text-zinc-300">
                    {[
                      "working first version",
                      "short walkthrough",
                      "handoff notes",
                      "7 days of fixes after delivery",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="h-px bg-white/10" />

                <p className="text-sm leading-6 text-zinc-400">
                  Before anything gets built, we agree on the workflow, the
                  output, and what a successful handoff looks like.
                </p>
              </div>
            </GlassCard>
          </div>
        </Section>

        <Section
          id="final-cta"
          eyebrow="Send The Workflow"
          title="Send the workflow"
          intro="A good first email can be rough. Just describe what happens now, what should come out the other end, and where the manual work gets annoying."
          className="border-t border-zinc-800/60 pt-12 sm:pt-14"
        >
          <GlassCard className="border-white/12 bg-white/[0.06] shadow-[0_18px_70px_rgba(0,0,0,0.34)]">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="space-y-4">
                <p className="text-sm font-medium text-zinc-100">Include:</p>
                <ul className="space-y-3 text-sm leading-6 text-zinc-300">
                  {[
                    "what you do manually",
                    "how often it happens",
                    "what tools, files, or systems are involved",
                    "what the final output should look like",
                    "roughly how long it currently takes",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-5 lg:pl-4">
                <div>
                  <a
                    href={MAILTO}
                    className="inline-flex min-w-[10.5rem] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/55 px-4 py-2 text-sm text-zinc-200 transition hover:border-zinc-700"
                  >
                    Send a workflow
                  </a>
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">Or email directly:</p>
                  <a
                    href={MAILTO}
                    className="text-zinc-300 underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-300"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </GlassCard>
        </Section>
      </section>
    </main>
  );
}
