import { getItem, setItem } from "@utils/localStorage";

export function toggleOpen(id: string) {
  const collapsed = JSON.parse(getItem("HELP_COLLAPSED") || "{}");
  const previous = collapsed[id] || false;
  setItem(
    "HELP_COLLAPSED",
    JSON.stringify({
      ...collapsed,
      [id]: !previous,
    }),
  );
}
