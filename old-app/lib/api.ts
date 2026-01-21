import type { AppType } from "@server/index";
import { hc } from "hono/client";
import { parseResponse } from "hono/client";

export const api = hc<AppType>(process.env.NEXT_PUBLIC_API_ORIGIN!, {
  init: {
    credentials: "include",
  },
  fetch: async (...args: Parameters<typeof fetch>) => {
    const res = await fetch(...args);

    // if (
    //   res.headers.get("X-CHURCH") === "0" &&
    //   !router.state.location.pathname.includes("/verify-email") &&
    //   !router.state.location.pathname.includes("/invitation")
    // ) {
    //   queryClient.invalidateQueries({
    //     queryKey: ["session"],
    //     refetchType: "all",
    //   });
    //   router.navigate({ to: "/onboarding" });
    // }

    if (res.status === 401) {
      window.location.href = "/signin";
    }
    return res;
  },
});

export const get = parseResponse;
