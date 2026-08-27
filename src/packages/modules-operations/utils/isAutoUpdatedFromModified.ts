export const DCTERMS_MODIFIED = "http://purl.org/dc/terms/modified";

export function isAutoUpdatedFromModified(msd?: { subPropertyOf?: string }): boolean {
  return msd?.subPropertyOf === DCTERMS_MODIFIED;
}
