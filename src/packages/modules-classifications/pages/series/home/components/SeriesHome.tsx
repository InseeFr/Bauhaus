import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { PartialClassificationSerie } from "@model/Classification";
import { useTitle } from "@utils/hooks/useTitle";

export const SeriesHome = ({
  series,
}: Readonly<{ series: PartialClassificationSerie[] | undefined }>) => {
  const { t } = useTranslation();

  useTitle(t("classification.pluralTitle"), t("serie.pluralTitle"));

  if (!series) {
    return null;
  }

  return (
    <div className="container">
      <Row>
        <div className="col-md-8 col-md-offset-2 text-center">
          <PageTitle title={t("serie.searchTitle")} col={12} offset={0} />
          <SearchableList items={series} childPath="classifications/series" autoFocus />
        </div>
      </Row>
    </div>
  );
};
