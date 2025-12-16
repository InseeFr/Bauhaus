import {
  BROADER,
  CLOSE_MATCH,
  IS_REPLACED_BY,
  NARROWER,
  REFERENCES,
  RELATED,
  SUCCEED,
} from "@sdk/constants";

import { D2 } from "../../../deprecated-locales";
import { Links, Link as LinkType } from "../../../model/concepts/concept";
import { LinksList } from "./LinkList";
import "./links.css";

const ConceptLinks = ({
  secondLang,
  links,
}: Readonly<{ secondLang: boolean; links: LinkType[] }>) => {
  const linksGroupByType: Links = links.reduce(
    (acc, link) => {
      if (!Array.isArray(acc[link.typeOfLink])) {
        return acc;
      }
      return {
        ...acc,
        [link.typeOfLink]: [...acc[link.typeOfLink], link],
      };
    },
    {
      [NARROWER]: [],
      [BROADER]: [],
      [REFERENCES]: [],
      [SUCCEED]: [],
      [RELATED]: [],
      [CLOSE_MATCH]: [],
      [IS_REPLACED_BY]: [],
    },
  );
  const numberOfLinks = Object.values(linksGroupByType).flat().length;
  if (numberOfLinks === 0) return null;

  return (
    <div className="row concept-links">
      <LinksList links={linksGroupByType} alone={!secondLang} lang="lg1" />
      {secondLang && (
        <LinksList links={linksGroupByType} alone={false} lang="lg2" Dictionnary={D2} />
      )}
    </div>
  );
};

export default ConceptLinks;
