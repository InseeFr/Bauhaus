import { ConceptGeneral } from "@model/concepts/concept";

import { prefixWithHttp } from "@utils/prefix-with-http";
import { takeKeys } from "@utils/take-keys";

export function processGeneral(
  general: Partial<ConceptGeneral>,
  keys: (keyof ConceptGeneral)[],
): Record<string, unknown> {
  const extract = takeKeys(keys as string[]);

  const extracted = extract(general as unknown as Record<string, unknown>) as Record<
    string,
    unknown
  >;

  extracted.additionalMaterial = prefixWithHttp((extracted.additionalMaterial as string) ?? "");

  if (typeof extracted.valid === "string") {
    extracted.valid = (extracted.valid as string).replace(/T\d{2}:00:00.000Z/, "T00:00:00.000Z");
  }

  return extracted;
}
