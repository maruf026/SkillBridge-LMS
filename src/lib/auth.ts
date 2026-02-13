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
      maxAge: 5 * 60,
    },
  },

  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: true, // Forces __Secure- prefix
    cookieOptions: {
      sameSite: "none", // Allows cross-site cookie storage
      secure: true,     // Required for sameSite: "none"
      httpOnly: true,
    },
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true,
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://skill-bridge-frontend-gules.vercel.app",
  ],

  // REMOVE the separate 'cookies' object to avoid overriding 'advanced'
  // Or if you keep it, use 'attributes' instead of 'options'
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