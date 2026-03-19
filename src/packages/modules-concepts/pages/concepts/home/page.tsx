import { Row } from "@components/layout";
import { Loading } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import { useConcepts } from "../../../hooks/useConcepts";
import { Menu } from "./menu";
import { useTranslation } from "react-i18next";

export const Component = () => {
  const { t } = useTranslation();
  useTitle(t("concept.title"), t("concept.title"));
  const { concepts, isLoading } = useConcepts();

  if (isLoading) return <Loading />;

  return (
    <div className="container">
      <Row>
        <Menu />
        <div className="col-md-8 text-center pull-right">
          <PageTitle title={t("concept.advancedSearch")} col={12} offset={0} />
          <SearchableList
            items={concepts}
            childPath="concepts"
            advancedSearch
            searchUrl="/concepts/search"
            placeholder={t("concept.searchPlaceholder")}
            autoFocus
          />
        </div>
      </Row>
    </div>
  );
};
