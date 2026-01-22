import { useState } from "react";

export const usePagination = () => {
  const [page, setPage] = useState(1);

  return { page, setPage };
};
