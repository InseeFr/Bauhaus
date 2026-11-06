import { linkTypes, type Link } from "@model/concepts/concept";

const getType = (typeOfLink: keyof typeof linkTypes) => {
  const type: string = linkTypes[typeOfLink];

  if (type) return type;

  throw new TypeError(`The type of a link was not recognized: \`${typeOfLink}\``);
};

// Un même concept peut être lié par plusieurs types (référence et remplace, par
// exemple) : le back renvoie alors un lien par type, qu'il faut tous garder.
export const mergeWithAllConcepts = (concepts: { id: string; label: string }[], links: Link[]) =>
  concepts.map(({ id, label }: { id: string; label: string }) => {
    const conceptLinks = links.filter(({ id: idLinked }: Link) => idLinked === id);
    return {
      id,
      label,
      typesOfLink: conceptLinks.map((link) => getType(link.typeOfLink)),
      prefLabelLg1: conceptLinks[0]?.prefLabelLg1,
      prefLabelLg2: conceptLinks[0]?.prefLabelLg2,
    };
  });
