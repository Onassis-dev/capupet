import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";

export const useFilter = (callback?: () => void) => {
  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 400);

  useEffect(() => {
    callback?.();
  }, [debouncedFilter]);

  return { filter, setFilter, debouncedFilter };
};
