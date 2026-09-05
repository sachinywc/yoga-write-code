import type { Metadata } from "next";
import Link from "next/link";
import { Field, FormError, PrimaryButton, inputClass } from "@/components/form";
import { signup } from "@/lib/auth/actions";

export const metadata: Metadata = { title: "Sign up" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm rounded-card border border-line bg-surface px-8 py-10">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand">
          Yoga Write Code
        </p>
        <h1 className="font-display mt-3 text-2xl font-semibold tracking-tight text-ink">
          Sign up
        </h1>
        <div className="mt-5">
          <FormError message={error} />
        </div>
        <form action={signup} className="mt-4 space-y-4">
          <Field label="Email" htmlFor="email">
            <input id="email" name="email" type="email" required className={inputClass} />
          </Field>
          <Field label="Password" htmlFor="password">
            <input id="password" name="password" type="password" required className={inputClass} />
            <p className="mt-1.5 text-xs text-ink-muted">At least 6 characters.</p>
          </Field>
          <PrimaryButton>Sign up</PrimaryButton>
        </form>
        <p className="mt-6 text-sm text-ink-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand underline underline-offset-4">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}