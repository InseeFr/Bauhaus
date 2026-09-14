import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import { Menu } from "../menu";

interface CollectionsHomeTypes {
  collections: { id: string; label: string }[];
}

export const CollectionsHome = ({ collections }: Readonly<CollectionsHomeTypes>) => {
  const { t } = useTranslation();

  useTitle(t("concept.title"), t("collection.title"));

  return (
    <div className="container">
      <Row>
        <Menu />
        <div className="col-md-8 text-center pull-right">
          <PageTitle title={t("collection.search.title")} col={12} offset={0} />
          <SearchableList items={collections} childPath="concepts/collections" autoFocus />
        </div>
      </Row>
    </div>
  );
};
