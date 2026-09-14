import { MetadataStructure } from "@model/Sims";

export function shouldDisplayTitleForPrimaryItem(msd: MetadataStructure) {
  return msd.isPresentational || (!msd.isPresentational && Object.keys(msd.children).length === 0);
}
