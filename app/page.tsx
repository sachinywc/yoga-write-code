import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Yoga Write Code — AI Content Operating System for SaaS",
  description:
    "Turn your SaaS website into a content plan. Get prioritized content opportunities, topic clusters, SEO briefs, and article outlines in one calm workspace.",
  alternates: { canonical: "https://yogawritecode.com" },
  openGraph: {
    title: "Yoga Write Code — AI Content Operating System for SaaS",
    description:
      "Turn your SaaS website into a content plan. Opportunities, clusters, briefs, outlines — all in one workspace.",
    url: "https://yogawritecode.com",
    siteName: "Yoga Write Code",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://yogawritecode.com/icon.svg",
        width: 108,
        height: 108,
        alt: "Yoga Write Code logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Yoga Write Code — AI Content Operating System for SaaS",
    description:
      "Turn your SaaS website into a content plan. Opportunities, clusters, briefs, outlines — all in one workspace.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

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

const faqs = [
  {
    q: "What is Yoga Write Code?",
    a: "Yoga Write Code is an AI content operating system for SaaS companies. It analyzes your website and turns it into prioritized content opportunities, topic clusters, SEO briefs, and article outlines you can draft in a built-in editor.",
  },
  {
    q: "How does the website analysis work?",
    a: "You submit your website URL. The system fetches publicly accessible pages, extracts real signals (title, description, headings, key terms), and uses an AI model to build a grounded company profile and content opportunities. Nothing is invented from thin air.",
  },
  {
    q: "Do I need to connect Google Search Console or other tools?",
    a: "No. The workflow starts from your public website alone. No Search Console, no analytics access, and no extra integrations are required to get your first content plan.",
  },
  {
    q: "Can I edit what the AI generates?",
    a: "Yes. Every draft opens in a document-style editor where you can write by hand, draft individual sections with AI, or rewrite your own text with AI. You stay in control of the final article.",
  },
  {
    q: "Is my data safe?",
    a: "Your workspace is private by default. Data is stored in a Postgres database with row-level security, so only your account can read your projects and drafts. Authentication uses secure server-side sessions.",
  },
  {
    q: "How much does it cost?",
    a: "Yoga Write Code is free to use while in beta. Paid plans may be introduced later, and any pricing will be shown clearly before purchase.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://yogawritecode.com/#organization",
      name: "Yoga Write Code",
      url: "https://yogawritecode.com",
      logo: "https://yogawritecode.com/icon.svg",
    },
    {
      "@type": "WebSite",
      "@id": "https://yogawritecode.com/#website",
      url: "https://yogawritecode.com",
      name: "Yoga Write Code",
      publisher: { "@id": "https://yogawritecode.com/#organization" },
    },
    {
      "@type": "SoftwareApplication",
      name: "Yoga Write Code",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: "https://yogawritecode.com",
      description:
        "AI content operating system that turns any SaaS website into prioritized content opportunities, topic clusters, SEO briefs, and article outlines.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": "https://yogawritecode.com/#organization" },
    },
    {
      "@type": "HowTo",
      name: "How Yoga Write Code turns your website into a content plan",
      step: steps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.title,
        text: s.text,
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function HomePage() {
  const appOrigin = process.env.NEXT_PUBLIC_SITE_URL || "";

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
        <a
          href={appOrigin ? `${appOrigin}/login` : "/login"}
          className="text-sm font-medium text-ink underline underline-offset-4"
        >
          Log in
        </a>
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
          <a
            href={appOrigin ? `${appOrigin}/signup` : "/signup"}
            className="inline-flex h-11 items-center rounded-field bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            Try Yoga Write Code
          </a>
          <a href="#how" className="text-sm font-medium text-ink underline underline-offset-4">
            See how it works
          </a>
        </div>
      </section>

      <section id="how" className="mt-24">
        <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
          How it works
        </h2>
        <ol className="mt-6 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-5">
          {steps.map((step) => (
            <li key={step.n} className="bg-surface px-5 py-6">
              <p className="text-xs font-medium text-brand">{step.n}</p>
              <h3 className="font-display mt-2 text-lg font-semibold tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[13px] leading-5 text-ink-secondary">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="faq" className="mt-24">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Frequently asked questions
        </h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-lg leading-none text-ink-muted transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-secondary">{f.a}</p>
            </details>
          ))}
        </div>
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}