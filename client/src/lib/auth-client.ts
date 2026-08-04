import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
// Type-only import — erased at build time, so no server code reaches the bundle.
// This is what keeps `user.additionalFields` defined in one place.
import type { auth } from "../../../server/src/auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export type Session = NonNullable<
  ReturnType<typeof authClient.useSession>["data"]
>;
export type Role = Session["user"]["role"];
