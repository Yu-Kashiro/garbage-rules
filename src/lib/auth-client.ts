import { createAuthClient } from "better-auth/react";
import { getBaseURL } from "./get-base-url";
import { inferAdditionalFields, anonymousClient } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: getBaseURL(),

  plugins: [anonymousClient(), inferAdditionalFields<typeof auth>()],
});
