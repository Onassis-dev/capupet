import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { accounts, sessions, users, verifications } from "../db/auth.db";
import { sendResetPasswordEmail, sendConfirmationEmail } from "./email";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      accounts,
      sessions,
      users,
      verifications,
    },
  }),

  advanced: {
    cookiePrefix: "x",
  },
  session: {
    cookieCache: {
      enabled: false,
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }: any) => {
      await sendResetPasswordEmail(user.email, url);
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }: any) => {
      await sendConfirmationEmail(user.email, url);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account",
      mapProfileToUser(profile) {
        return {
          name: profile.name,
          image: profile.picture,
        };
      },
    },
  },

  trustedOrigins: [process.env.APP_ORIGIN!],

  user: {
    additionalFields: {
      lang: {
        type: "string",
        required: false,
        defaultValue: "es",
      },
      theme: {
        type: "string",
        required: false,
        defaultValue: "light",
      },
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (
        (ctx.path === "/callback/:id" || ctx.path === "/sign-up") &&
        !ctx.context.newSession?.user.lang &&
        ctx.context.newSession?.user.id
      ) {
        let lang = ctx.request?.headers.get("accept-language")?.substring(0, 2);
        if (lang !== "es" && lang !== "en") lang = "en";

        await db
          .update(users)
          .set({
            lang: lang,
          })
          .where(eq(users.id, ctx.context.newSession?.user.id));
      }
    }),
  },
}) as ReturnType<typeof betterAuth>;
