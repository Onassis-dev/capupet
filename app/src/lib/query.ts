import { showError } from "./toast";
import {
  keepPreviousData,
  MutationCache,
  QueryClient,
} from "@tanstack/react-query";

const errorMessage = {
  es: "Ocurrió un error",
  en: "An error occurred",
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData,
    },
  },
  mutationCache: new MutationCache({
    onError: (error: any) => {
      showError(
        error?.detail?.data?.message ||
          errorMessage[
            localStorage.getItem("language") as keyof typeof errorMessage
          ] ||
          errorMessage.en
      );
    },
  }),
});
