import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // This section ensures cookies work across your two different Vercel domains
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: true, // Required for __Secure- prefix and cross-site
    cookieOptions: {
      sameSite: "none", // Allows the browser to save cookie from backend domain
      secure: true,     // Required for SameSite=None
      httpOnly: true,   // Security best practice
    },
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true, // Helps with cross-origin requests
  },

  // Explicitly allowing your frontend to talk to this auth instance
  trustedOrigins: [
    "http://localhost:3000",
    "https://skill-bridge-frontend-gules.vercel.app",
  ],

  // Specific override for the session token to fix the "Yellow Triangle" error
  cookies: {
    sessionToken: {
      attributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
  },
});