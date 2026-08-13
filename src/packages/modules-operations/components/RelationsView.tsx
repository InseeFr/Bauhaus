import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import "./RelationsView.css";

export interface RelationsViewPerLgContentTypes {
  children: { id: string; labelLg1: string; labelLg2: string }[];
  childrenTitle: string;
  childrenPath: string;
  parent: { id: string; labelLg1: string; labelLg2: string };
  parentTitle: string;
  parentPath: string;
  langSuffix: "Lg1" | "Lg2";
}

export const RelationsViewPerLgContent = ({
  children,
  childrenTitle,
  childrenPath,
  parent,
  parentTitle,
  parentPath,
  langSuffix,
}: Readonly<RelationsViewPerLgContentTypes>) => {
  const { t } = useTranslation();
  const lng = langSuffix === "Lg1" ? "fr" : "en";

  return (
    <>
      {parent && (
        <p>
          <span className="links-title">{t(`common.${parentTitle}`, { lng })}</span>
          <Link to={`/operations/${parentPath}/${parent.id}`}>{parent[`label${langSuffix}`]}</Link>
        </p>
      )}
      {children && (
        <>
          <p>
            <span className="links-title">{t(`common.${childrenTitle}`, { lng })}</span>
          </p>
          <ul>
            {children
              .sort(function (a, b) {
                return a[`label${langSuffix}`].localeCompare(b[`label${langSuffix}`]);
              })
              .map((item) => (
                <li key={item.id}>
                  <Link to={`/operations/${childrenPath}/${item.id}`}>
                    {item[`label${langSuffix}`]}
                  </Link>
                </li>
              ))}
          </ul>
        </>
      )}
    </>
  );
};

export function RelationsViewPerLg({
  title,
  secondLang,
  ...props
}: RelationsViewPerLgContentTypes &
  Readonly<{
    title: string;
    secondLang: boolean;
  }>) {
  return (
    <Note
      text={<RelationsViewPerLgContent {...props} />}
      title={title}
      alone={!secondLang}
      allowEmpty={true}
    />
  );
}

export function RelationsView(
  props: Readonly<{ secondLang: boolean } & RelationsViewPerLgContentTypes>,
) {
  const { t } = useTranslation();

  return (
    <Row>
      <RelationsViewPerLg {...props} title={t("app.linksTitle", { lng: "fr" })} langSuffix="Lg1" />
      {props.secondLang && (
        <RelationsViewPerLg
          {...props}
          title={t("app.linksTitle", { lng: "en" })}
          langSuffix="Lg2"
        />
      )}
    </Row>
  );
}
