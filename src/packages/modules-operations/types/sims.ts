import { Mode } from "../pages/sims/constants";

export interface SimsLoaderData {
  mode?: Mode;
  baseUrl?: string;
  disableSectionAnchor?: boolean;
  parentType?: string;
}
