import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Yoga Write Code" };

const steps = [
  {
    n: "01",
    title: "Analyze",
    text: "Point it at your SaaS website. It reads the page and builds a grounded company profile.",
  },
  {
    n: "02",
    title: "Opportunities",
    text: "Prioritized content opportunities with score, intent, and funnel stage.",
  },
  {
    n: "03",
    title: "Cluster",
    text: "A pillar topic with supporting articles and internal linking.",
  },
  {
    n: "04",
    title: "SEO brief",
    text: "Keyword, headings, questions, entities — a real working brief.",
  },
  {
    n: "05",
    title: "Outline",
    text: "An editorial outline, ready for the document editor.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 pb-24 pt-10">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Yoga Write Code home">
          <svg width="28" height="28" viewBox="0 0 108 108" fill="none" aria-hidden="true">
            <rect width="108" height="108" rx="21.6" fill="#58AE39" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M46.1349 26.4156C48.2025 25.3265 50.7459 26.4734 51.2953 28.7445L52.7635 34.8401L84.5301 33.988C85.7602 33.9573 86.8484 34.7803 87.1539 35.9722L87.6467 37.895C87.9242 38.9779 87.5643 40.1245 86.7177 40.8546L75.7605 50.3039L90.1625 67.7559C90.7236 68.4374 90.9141 69.3535 90.6737 70.2029L90.6471 70.2954C90.2452 71.6924 88.8837 72.5867 87.442 72.4007L60.6549 68.9444L59.2785 76.9364L52.8684 69.1149L26.3769 80.2038C25.0365 80.7649 23.4872 80.2638 22.7293 79.024L22.6791 78.942C22.2195 78.187 22.1609 77.2542 22.5222 76.4475L31.7722 55.7964L18.6541 49.2529C17.6766 48.7652 17.0495 47.7763 17.0254 46.6841L16.9883 45.004C16.9612 43.775 17.7895 42.6914 18.9825 42.395L45.5057 35.8451L44.304 30.3569C43.9587 28.7814 44.7083 27.1679 46.1349 26.4156ZM25.2496 46.0917L33.9569 50.8283L35.494 47.2984C36.0859 45.9391 37.6673 45.3166 39.0269 45.9078C40.3872 46.4992 41.0103 48.0815 40.4187 49.4417L38.6979 53.3976L47.379 57.2899C48.7312 57.8962 49.3363 59.4837 48.7306 60.8363C48.1247 62.1892 46.5369 62.7949 45.1839 62.1892L36.5262 58.3133L30.1511 72.5406L51.6405 63.8233L46.6549 41.0973L25.2496 46.0917ZM54.0525 40.1753L59.663 63.4257L81.7686 66.0168L71.8453 53.9918L64.5267 60.0266C63.3825 60.97 61.6903 60.8074 60.7467 59.6635C59.8033 58.5223 59.9643 56.8323 61.1063 55.8898L68.4458 49.832L65.7336 46.47C64.8034 45.317 64.9827 43.6284 66.1343 42.6965C67.2906 41.7647 68.9832 41.9458 69.9162 43.1011L72.3347 46.096L79.0483 39.5242L54.0525 40.1753Z"
              fill="white"
            />
          </svg>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Yoga Write Code
          </span>
        </Link>
        <Link href="/login" className="text-sm font-medium text-ink underline underline-offset-4">
          Log in
        </Link>
      </header>

      <section className="mt-24">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
          AI Content Operating System for SaaS
        </p>
        <h1 className="font-display mt-5 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-tight text-ink">
          Turn your website into your next content plan.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-ink-secondary">
          Yoga Write Code analyzes your SaaS website and turns it into prioritized content
          opportunities, topic clusters, SEO briefs, and article outlines.
        </p>
        <div className="mt-9 flex items-center gap-4">
          <Link
            href="/signup"
            className="inline-flex h-11 items-center rounded-field bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            Try Yoga Write Code
          </Link>
          <a href="#how" className="text-sm font-medium text-ink underline underline-offset-4">
            See how it works
          </a>
        </div>
      </section>

      <section id="how" className="mt-24">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
          How it works
        </p>
        <ol className="mt-6 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-5">
          {steps.map((step) => (
            <li key={step.n} className="bg-surface px-5 py-6">
              <p className="text-xs font-medium text-brand">{step.n}</p>
              <h2 className="font-display mt-2 text-lg font-semibold tracking-tight text-ink">
                {step.title}
              </h2>
              <p className="mt-2 text-[13px] leading-5 text-ink-secondary">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mt-24 flex items-center justify-between border-t border-line pt-6 text-sm text-ink-muted">
        <p>© 2026 Yoga Write Code</p>
        <div className="flex gap-6">
          <Link href="/terms" className="underline underline-offset-4">
            Terms
          </Link>
          <Link href="/privacy" className="underline underline-offset-4">
            Privacy
          </Link>
        </div>
      </footer>
    </main>
  );
}