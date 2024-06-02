import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import db from "./db/db";

import { comparePasswords } from "./app/_utils/utils";


export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await db.user.findUnique({ where: { email: email } });
          if (!user) return null;
          const passwordsMatch = comparePasswords(password, user.password);

          if (passwordsMatch) return user as any;

          console.log("Invalid Credentials");
          return null;
        }
      },
    }),
  ],
});
