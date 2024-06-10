import NextAuth, { User } from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import db from "./db/db";
import bcrypt from "bcryptjs";

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials): Promise<User | null> {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = await db.user.findUnique({ where: { email: email } });
        if (!user) return null;
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) return {id: user.id, email: user.email};

        console.log("Invalid Credentials");
        return null;
      },
    }),
  ],
});
