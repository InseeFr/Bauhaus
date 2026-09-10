import { getItem } from "@utils/localStorage";

export function isOpen(id: string) {
  const collapsed = JSON.parse(getItem("HELP_COLLAPSED") || "{}");

  return collapsed[id] || false;
}
