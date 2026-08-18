import { NONE } from "@sdk/constants";

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
