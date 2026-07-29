import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

interface Family {
  id: string;
  label: string;
  [key: string]: unknown;
}

type Props = Readonly<{
  families: Family[];
}>;

export const FamiliesHome = ({ families }: Props) => {
  const { t } = useTranslation();

  useTitle(t("classification.pluralTitle"), t("family.pluralTitle"));

  return (
    <div className="container">
      <Row>
        <div className="col-md-8 col-md-offset-2 text-center">
          <PageTitle title={t("family.searchTitle")} col={12} offset={0} />
          <SearchableList items={families} childPath="classifications/family" autoFocus />
        </div>
      </Row>
    </div>
  );
};
