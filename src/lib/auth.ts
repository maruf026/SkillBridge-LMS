import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
     trustedOrigins: [
    process.env.APP_URL!,
    "https://skill-bridge-liard.vercel.app",
  ],

  cookies: {
    sessionToken: {
      path: "/", 
    },
    options: {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    },
  },
   
  user: {
       additionalFields: {
        role: {
          type: "string",
          defaultValue: "STUDENT",
          required: false,
        }
       }
  },
     emailAndPassword: { 
    enabled: true, 
  }, 
});