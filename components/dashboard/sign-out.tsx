import { logout } from "@/lib/auth/actions";

export function SignOut() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="w-full rounded-md px-3 py-2 text-left text-sm text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
      >
        Sign out
      </button>
    </form>
  );
}