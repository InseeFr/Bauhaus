import { useTranslation } from "react-i18next";

import { Note } from "@components/note";

import { Links } from "@model/concepts/concept";

import { BROADER, IS_REPLACED_BY, NARROWER, REFERENCES, RELATED, SUCCEED } from "@sdk/constants";

import { CloseMatchLinks } from "./CloseMatchLinks";
import { InternalLinks } from "./InternalLinks";

export const LinksList = ({
  links,
  lang,
  alone,
  language = "fr",
}: Readonly<{
  links: Links;
  lang: "lg1" | "lg2";
  alone: boolean;
  language?: "fr" | "en";
}>) => {
  const { i18n } = useTranslation();

  const t = i18n.getFixedT(language);

  const labelProperty = lang === "lg1" ? "prefLabelLg1" : "prefLabelLg2";

  const dictionnary: Record<string, string> = {
    closeMatchTitle: t("concept.links.equivalentTitle"),
    linksTitle: t("common.linksTitle"),
  };

  return (
    <Note
      text={
        <dl>
          <InternalLinks
            links={links[NARROWER]}
            title={t("concept.links.narrowerTitle")}
            labelProperty={labelProperty}
          />
          <InternalLinks
            links={links[BROADER]}
            title={t("concept.links.broaderTitle")}
            labelProperty={labelProperty}
          />
          <InternalLinks
            links={links[REFERENCES]}
            title={t("concept.links.referencesTitle")}
            labelProperty={labelProperty}
          />
          <InternalLinks
            links={links[SUCCEED]}
            title={t("concept.links.replacesTitle")}
            labelProperty={labelProperty}
          />
          <InternalLinks
            links={links[RELATED]}
            title={t("concept.links.relatedTitle")}
            labelProperty={labelProperty}
          />
          <InternalLinks
            links={links[IS_REPLACED_BY]}
            title={t("concept.links.replacedByMasc")}
            labelProperty={labelProperty}
          />
          <CloseMatchLinks links={links.closeMatch} Dictionnary={dictionnary} />
        </dl>
      }
      title={t("common.linksTitle")}
      alone={alone}
    />
  );
};
