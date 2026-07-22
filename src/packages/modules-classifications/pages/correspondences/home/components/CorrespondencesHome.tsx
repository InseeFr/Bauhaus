import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

export const CorrespondencesHome = ({ correspondences }: { correspondences: any }) => {
  const { t } = useTranslation();

  useTitle(t("classification.pluralTitle"), t("correspondence.pluralTitle"));

  return (
    <div className="container">
      <Row>
        <div className="col-md-8 col-md-offset-2 text-center">
          <PageTitle title={t("correspondence.searchTitle")} col={12} offset={0} />
          <SearchableList
            items={correspondences}
            childPath="classifications/correspondence"
            autoFocus
          />
        </div>
      </Row>
    </div>
  );
};
