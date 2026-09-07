export function getParentIdName(parentType: "operation" | "series" | "indicator") {
  if (parentType === "operation") {
    return "idOperation";
  }
  if (parentType === "series") {
    return "idSeries";
  }
  if (parentType === "indicator") {
    return "idIndicator";
  }
}
