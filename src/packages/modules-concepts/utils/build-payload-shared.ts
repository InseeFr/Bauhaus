import { NONE } from "@sdk/constants";

import { prefixWithHttp } from "@utils/prefix-with-http";
import { takeKeys } from "@utils/take-keys";

import { ConceptGeneral } from "../../model/concepts/concept";

interface LinkInput {
  id: string;
  typeOfLink: string;
}

interface LinkOutput {
  typeOfLink: string;
  ids: string[];
}

export function processLinks(conceptsWithLinks: LinkInput[]): LinkOutput[] {
  const linksObj = conceptsWithLinks.reduce<Record<string, string[]>>(
    (links, { id, typeOfLink }) => {
      if (typeOfLink === NONE) return links;
      if (!links[typeOfLink]) links[typeOfLink] = [id];
      else links[typeOfLink].push(id);
      return links;
    },
    {},
  );

  return Object.keys(linksObj).reduce<LinkOutput[]>((linkArr, typeOfLink) => {
    linkArr.push({
      typeOfLink,
      ids: linksObj[typeOfLink],
    });
    return linkArr;
  }, []);
}

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
