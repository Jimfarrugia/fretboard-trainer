import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createUser } from "./actions/createUser";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const googleUser = {
        name: user.name ?? undefined,
        email: user.email ?? undefined,
        image: user.image ?? undefined,
      };
      createUser(googleUser);
      return true;
    },
  },
});
