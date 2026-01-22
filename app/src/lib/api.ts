import type { AppType } from '@server/index';
import { hc, parseResponse } from 'hono/client';

export const api = hc<AppType>(import.meta.env.VITE_API_ORIGIN!, {
  init: {
    credentials: 'include',
  },
  fetch: async (...args: Parameters<typeof fetch>) => {
    const res = await fetch(...args);

    if (res.status === 401) {
      window.location.href = '/signin';
    }
    return res;
  },
});

export const get = parseResponse;
