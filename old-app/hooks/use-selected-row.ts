import { useState } from "react";

export const useSelectedRow = () => {
  const [selectedRow, setSelectedRow] = useState<null | Record<
    string,
    unknown
  >>(null);

  return { selectedRow, setSelectedRow };
};
