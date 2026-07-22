import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import { PartialClassification } from "../../../../types";

interface ClassificationsHomeTypes {
  classifications: PartialClassification[];
}

export const ClassificationsHome = ({ classifications }: Readonly<ClassificationsHomeTypes>) => {
  const { t } = useTranslation();

  useTitle(t("classification.pluralTitle"), t("classification.pluralTitle"));

  return (
    <div className="container">
      <Row>
        <div className="col-md-8 col-md-offset-2 text-center">
          <PageTitle title={t("classification.searchTitle")} col={12} offset={0} />
          <SearchableList
            items={classifications}
            childPath="classifications/classification"
            autoFocus
          />
        </div>
      </Row>
    </div>
  );
};
