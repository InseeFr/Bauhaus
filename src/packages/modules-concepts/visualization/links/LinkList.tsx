import { Note } from "@components/note";

import { Links } from "@model/concepts/concept";

import { BROADER, IS_REPLACED_BY, NARROWER, REFERENCES, RELATED, SUCCEED } from "@sdk/constants";

import { D1 } from "../../../deprecated-locales";
import { CloseMatchLinks } from "./CloseMatchLinks";
import { InternalLinks } from "./InternalLinks";

export const LinksList = ({
  links,
  lang,
  alone,
  Dictionnary = D1,
}: Readonly<{
  links: Links;
  lang: "lg1" | "lg2";
  alone: boolean;
  Dictionnary?: Record<string, string>;
}>) => {
  const labelProperty = lang === "lg1" ? "prefLabelLg1" : "prefLabelLg2";
  return (
    <Note
      text={
        <dl>
          <InternalLinks
            links={links[NARROWER]}
            title={Dictionnary.narrowerTitle}
            labelProperty={labelProperty}
          />
          <InternalLinks
            links={links[BROADER]}
            title={Dictionnary.broaderTitle}
            labelProperty={labelProperty}
          />
          <InternalLinks
            links={links[REFERENCES]}
            title={Dictionnary.referencesTitle}
            labelProperty={labelProperty}
          />
          <InternalLinks
            links={links[SUCCEED]}
            title={Dictionnary.replacesTitle}
            labelProperty={labelProperty}
          />
          <InternalLinks
            links={links[RELATED]}
            title={Dictionnary.relatedTitle}
            labelProperty={labelProperty}
          />
          <InternalLinks
            links={links[IS_REPLACED_BY]}
            title={Dictionnary.replacedByMasc}
            labelProperty={labelProperty}
          />
          <CloseMatchLinks links={links.closeMatch} Dictionnary={Dictionnary} />
        </dl>
      }
      title={Dictionnary.linksTitle}
      alone={alone}
    />
  );
};
