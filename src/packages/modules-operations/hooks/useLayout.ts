import { useState } from "react";
import { getItem, setItem } from "@utils/localStorage";
export const Status = {
  BOTH: "BOTH",
  SUMMARY: "SUMMARY",
  CONTENT: "CONTENT",
} as const;
export type Status = (typeof Status)[keyof typeof Status];

export const useLayout = (): [layoutMode: Status, changeLayoutMode: (mode: Status) => void] => {
  const [layoutMode, setLayoutMode] = useState<Status>(
    () => (getItem("HELP_VIEW") as unknown as Status) || Status.BOTH,
  );

  const changeLayoutMode = (status: Status): void => {
    setItem("HELP_VIEW", status as unknown as string);
    setLayoutMode(status);
  };

  return [layoutMode, changeLayoutMode];
};
