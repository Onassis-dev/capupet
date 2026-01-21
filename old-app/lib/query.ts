import { showError } from "./toast";
import {
  keepPreviousData,
  MutationCache,
  QueryClient,
} from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData,
    },
  },
  mutationCache: new MutationCache({
    onError: () => {
      showError("TODO: ADD THIS MESSAGE");
    },
  }),
});
