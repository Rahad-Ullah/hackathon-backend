import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import type { PrismaService } from '../database/prisma.service';

export function createAuth(prisma: PrismaService) {
  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'participant',
          input: true,
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      async sendResetPassword({ user, url, token }) {
        console.log(`[BetterAuth] Password Reset email requested for ${user.email}. URL: ${url}, Token: ${token}`);
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      async sendVerificationEmail({ user, url, token }) {
        console.log(`[BetterAuth] Email verification requested for ${user.email}. URL: ${url}, Token: ${token}`);
      },
    },
  });
}

export type BetterAuthInstance = ReturnType<typeof createAuth>;
