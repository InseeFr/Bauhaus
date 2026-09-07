import { MUTUALIZED_COMPONENT_TYPES } from "../constants";

export const typeUriToLabel = (uri = "") => {
  return MUTUALIZED_COMPONENT_TYPES.find((component) => component.value === uri)?.label;
};
