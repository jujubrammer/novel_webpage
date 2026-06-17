// app/admin/SignOutButton.js
// A tiny CLIENT component: a button that signs the keeper out and returns them
// to the public home page. It must be a client component because it has an
// onClick handler that runs in the browser.

"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/"); // back to the public archive
    router.refresh(); // re-run server components so the session clears
  }

  return (
    <button type="button" onClick={handleSignOut} className="signout">
      Sign out
    </button>
  );
}
