import type { Metadata } from "next";
import { LegalDoc, LegalSection } from "@/components/legal-doc";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Yoga Write Code.",
};

export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy Policy" updated="September 11, 2026">
      <LegalSection n="1" title="Who we are">
        <p>
          Yoga Write Code ("we", "us") operates the Yoga Write Code web application
          (yogawritecode.com). We are currently based in Nepal. This policy explains what we
          collect, why, and your choices.
        </p>
      </LegalSection>

      <LegalSection n="2" title="Information we collect">
        <p>Account information: email address and password hash, managed by Supabase.</p>
        <p>
          Content you create: project names, website URLs you submit, and the analyses,
          opportunities, clusters, briefs, outlines, and drafts the service generates or you write.
        </p>
        <p>
          Website data you submit: when you ask us to analyze a website, we fetch publicly
          accessible pages from that site (title, meta description, headings, and page text) to
          produce the analysis.
        </p>
        <p>
          Technical information: standard server logs (IP address, user agent, timestamps) kept by
          our hosting provider for security and debugging. We do not currently run marketing
          analytics or tracking pixels.
        </p>
      </LegalSection>

      <LegalSection n="3" title="How we use information">
        <ul className="list-disc space-y-1 pl-5">
          <li>to operate, secure, and improve the service;</li>
          <li>to generate the analyses and content you request;</li>
          <li>to authenticate you and persist your workspace;</li>
          <li>to respond to support requests;</li>
          <li>to comply with legal obligations.</li>
        </ul>
        <p>We do not sell personal data.</p>
      </LegalSection>

      <LegalSection n="4" title="AI processing">
        <p>
          To generate results, the website text and project context you submit are sent to our AI
          provider, Amazon Bedrock (Anthropic Claude models), under our account. AI providers
          process this input to produce outputs for you. We do not claim that submitted data is
          never used for model training unless the relevant provider contractually confirms it;
          current provider terms: [TO BE CONFIRMED per provider documentation].
        </p>
      </LegalSection>

      <LegalSection n="5" title="Third-party service providers">
        <ul className="list-disc space-y-1 pl-5">
          <li>Vercel — application hosting and edge delivery;</li>
          <li>Supabase — PostgreSQL database, authentication, and row-level security;</li>
          <li>Amazon Web Services (Bedrock) — AI model inference;</li>
          <li>Stripe — payments, if and when paid plans launch [TO BE CONFIRMED].</li>
        </ul>
        <p>Each provider processes data under its own privacy terms.</p>
      </LegalSection>

      <LegalSection n="6" title="Cookies">
        <p>
          We use only essential session cookies required for authentication (Supabase SSR auth
          cookies). We do not use advertising or cross-site tracking cookies.
        </p>
      </LegalSection>

      <LegalSection n="7" title="Data sharing">
        <p>
          We share data only with the providers listed above, or when required by law. We do not
          share your drafts or analyses with other users; access is enforced per-account by
          database row-level security policies.
        </p>
      </LegalSection>

      <LegalSection n="8" title="Retention and deletion">
        <p>
          We keep your data while your account exists. You can delete projects (which cascades to
          analyses, opportunities, clusters, briefs, outlines) and drafts from the dashboard at any
          time. Account deletion: contact support@yogawritecode.com [mailbox to be provisioned];
          we will delete or anonymize your personal data within a reasonable period. Specific
          backup retention windows: [TO BE CONFIRMED].
        </p>
      </LegalSection>

      <LegalSection n="9" title="Security">
        <p>
          We use industry-standard measures: HTTPS everywhere, hashed passwords, server-side
          session cookies, row-level security in the database, and server-only secret storage. No
          method of transmission or storage is 100% secure.
        </p>
      </LegalSection>

      <LegalSection n="10" title="International transfers">
        <p>
          Our providers process data in regions including the United States and Europe. By using
          the service from other countries, you consent to these transfers as necessary to provide
          the service.
        </p>
      </LegalSection>

      <LegalSection n="11" title="Your rights">
        <p>
          Depending on your location (e.g., GDPR, CCPA), you may have rights to access, correct,
          export, or delete your personal data. To exercise them, email
          support@yogawritecode.com. We will respond within a reasonable timeframe. Including this
          section does not by itself constitute a claim of compliance with any specific regime.
        </p>
      </LegalSection>

      <LegalSection n="12" title="Children">
        <p>The service is not directed to children under 16. We do not knowingly collect their data.</p>
      </LegalSection>

      <LegalSection n="13" title="Changes">
        <p>
          We may update this policy. The "Last updated" date will change, and material changes
          will be announced in the product.
        </p>
      </LegalSection>

      <LegalSection n="14" title="Contact">
        <p>support@yogawritecode.com [mailbox to be provisioned].</p>
      </LegalSection>
    </LegalDoc>
  );
}