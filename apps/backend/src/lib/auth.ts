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
    trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',') || ['http://localhost:5173'],
    cookie: {
        name: 'better-auth.session',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    },
});
