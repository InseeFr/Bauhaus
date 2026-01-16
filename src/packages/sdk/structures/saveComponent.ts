import { Component } from "../../model/structures/Component";
import { StructureApi } from "../structure-api";

export const saveComponent = (component: Component): Promise<string | undefined> => {
  // We need to sync value if the user does not change the codelist select input
  if (!!component.codeList && !component.fullCodeListValue) {
    component.fullCodeListValue = component.codeList;
  }

  if (component.id) {
    return StructureApi.putMutualizedComponent(component);
  }

  return StructureApi.postMutualizedComponent(component);
};
