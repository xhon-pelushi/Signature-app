"use client";
import { useSession, signOut } from "next-auth/react";

export function AuthStatus() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div className="text-sm text-gray-500">Checking auth…</div>;
  }
  if (session?.user?.email) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">{session.user.email}</span>
        <button
          className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      </div>
    );
  }
  return (
    <a className="px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" href="/signin">
      Sign in
    </a>
  );
}
