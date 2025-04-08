import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@mail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials.email) {
          // If email exists, we simply bypass password check for OTP login.
          const user = await db.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            return null;
          }

          // Add this check if you are using OTP login, no need to check the password
          if (user.otpVerified) {
            return {
              id: user.id,
              email: user.email,
              username: user.username,
            };
          }

          // If password provided, validate the password for regular login
          if (credentials.password) {
            const passwordMatch = await compare(credentials.password, user.password);
            if (!passwordMatch) {
              return null;
            }
          }

          return {
            id: user.id,
            username: user.username,
            email: user.email,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return { ...token, username: user.username, email: user.email };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
          email: token.email,
        },
      };
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.username) {
        const username =
          user.email.split("@")[0] + Math.floor(Math.random() * 1000);
        await db.user.update({
          where: { id: user.id },
          data: { username },
        });
      }
    },
  },
};
