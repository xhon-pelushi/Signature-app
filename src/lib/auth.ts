import type { NextAuthOptions, User, Awaitable } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
      },
  authorize(creds): Awaitable<User | null> {
        const email = (creds?.email as string | undefined)?.trim() ?? "";
        if (email && email.includes("@")) {
      return { id: email, email, name: email.split("@")[0] } as User;
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
