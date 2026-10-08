import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { FilterToggleButtons } from "@components/filter-toggle-buttons";
import { HomePageLayout } from "@components/home-page-layout";
import { SearchableList } from "@components/searchable-list";

import { HomeDocument } from "@model/operations/document";

import { useTitle } from "@utils/hooks/useTitle";

import { BOTH, DOCUMENT, LINK } from "../../../../../constants/documentType";
import { isDocument } from "../../../../utils/isDocument";
import { isLink } from "../../../../utils/isLink";
import { Menu } from "../menu";

const formatter = (content: HomeDocument) => {
  const extraInformations = [];

  if (content.lang) {
    extraInformations.push(content.lang);
  }

  if (content.updatedDate) {
    const [year, month, day] = content.updatedDate.split("-");
    extraInformations.push(`${day}/${month}/${year}`);
  }

  return (
    <>
      {content.label}{" "}
      <i>{extraInformations.length > 0 ? `(${extraInformations.join("-")})` : ""}</i>
    </>
  );
};

const sessionStorageKey = "documents-displayMode";

export function DocumentHome({ documents }: Readonly<{ documents: HomeDocument[] }>) {
  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), t("documents.title"));

  const navigate = useNavigate();

  const queryMode = sessionStorage.getItem(sessionStorageKey);

  const [filter, setFilter] = useState(queryMode || BOTH);

  const filteredDocuments = documents.filter((document: HomeDocument) => {
    return (
      filter === BOTH ||
      (filter === DOCUMENT && isDocument(document)) ||
      (filter === LINK && isLink(document))
    );
  });

  const onFilter = useCallback(
    (mode: typeof BOTH | typeof DOCUMENT | typeof LINK) => {
      sessionStorage.setItem(sessionStorageKey, mode);
      setFilter(mode);
      navigate(window.location.pathname + "?page=1", { replace: true });
    },
    [navigate],
  );

  return (
    <HomePageLayout title={t("documents.searchTitle")} menu={<Menu />}>
      <FilterToggleButtons
        currentValue={filter}
        handleSelection={onFilter}
        options={[
          [DOCUMENT, t("documents.document")],
          [BOTH, `${t("documents.document")} / ${t("documents.titleLink")}`],
          [LINK, t("documents.titleLink")],
        ]}
      />
      <SearchableList
        items={filteredDocuments}
        childPath={(document: HomeDocument) => {
          if (isDocument(document)) {
            return "operations/document";
          }
          return "operations/link";
        }}
        itemFormatter={(_label: string, document: HomeDocument) => formatter(document)}
        searchFields={["label"]}
        autoFocus
      />
    </HomePageLayout>
  );
}
