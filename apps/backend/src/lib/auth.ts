import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { dash } from "@better-auth/infra";
import * as schema from "@l-spa/database/schema";
import { db } from "@l-spa/database";

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
