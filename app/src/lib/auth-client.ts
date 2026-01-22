import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_ORIGIN!,
  plugins: [
    inferAdditionalFields({
      user: {
        lang: {
          type: "string",
        },
        theme: {
          type: "string",
        },
      },
    }),
  ],
});
