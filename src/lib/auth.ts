import { betterAuth, type BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI, admin } from 'better-auth/plugins';
import { headers } from 'next/headers';
import { cache } from 'react';
import { db } from '@/db';
import { account, session, user, verification } from '@/db/schema';
import { transporter } from '@/db/mailer';

export const auth = betterAuth({
  // ← TAMBAH
  appName: 'Sentra Rent',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET || '',
  trustedOrigins: ['http://localhost:3000', 'http://localhost:3001'],
  // ↑ TAMBAH

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      account,
      session,
      user,
      verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true, // ← TAMBAH
    sendResetPassword: async ({ user, url }: any) => {
      await transporter.sendMail({
        to: user.email,
        subject: 'Reset Password Sentra Rent',
        html: `
          <p>Halo ${user.name ?? 'User'},</p>
          <p>Klik link berikut untuk reset password:</p>
          <a href="${url}">${url}</a>
          <p>Link berlaku beberapa menit.</p>
        `,
      });
    },
  },

  // ← TAMBAH
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      await transporter.sendMail({
        to: user.email,
        subject: 'Verify Email - Sentra Rent',
        html: `
          <p>Halo ${user.name ?? 'User'},</p>
          <p>Klik link berikut untuk memverifikasi email Anda:</p>
          <a href="${url}">${url}</a>
          <p>Link berlaku 1 jam.</p>
        `,
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600, // 1 hour
  },
  // ↑ TAMBAH

  plugins: [
    openAPI(),
    admin({
      impersonationSessionDuration: 60 * 60 * 24 * 7,
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 3, // 3 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  rateLimit: {
    window: 60,
    max: 5,
  },
} satisfies BetterAuthOptions);

export const getServerSession = cache(
  async () =>
    await auth.api.getSession({
      headers: await headers(),
    }),
);

export type Session = typeof auth.$Infer.Session;
export type AuthUserType = Session['user'];
