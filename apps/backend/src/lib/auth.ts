import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { dash } from "@better-auth/infra";
import * as schema from "@l-spa/database/schema";
import { db } from "@l-spa/database";

// better-auth provides built-in CSRF protection for all auth routes by default
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    basePath: "/api/v1/auth",
    plugins: [
        dash()
    ],
    emailAndPassword: {
        enabled: true
    },
    trustedOrigins: ['http://localhost:5173','http://localhost:5174'],

    // We will uncomment this when we have the actual credentials
    /*
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }
    }
    */
});
