import { useTranslation } from "react-i18next";

import { TreeButton } from "@components/buttons/buttons-with-icons";
import { LoadingErrorBloc } from "@components/errors-bloc";
import { Row } from "@components/layout";
import { Loading } from "@components/loading";
import { FeminineButton } from "@components/new-button";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";
import { VerticalMenu } from "@components/vertical-menu";

import { useTitle } from "@utils/hooks/useTitle";

import { HasAccess } from "../../../../auth/components/auth";
import { useFamilies } from "../../../hooks/useFamilies";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), t("common.familiesTitle"));

  const { data: families = [], isLoading, error } = useFamilies();

  if (isLoading) return <Loading />;

  if (error) return <LoadingErrorBloc error={error} />;

  return (
    <div className="container">
      <Row>
        <VerticalMenu>
          <HasAccess module="OPERATION_FAMILY" privilege="CREATE">
            <FeminineButton action="/operations/families/create" />
          </HasAccess>
          <TreeButton wrapper={false} action="/operations/tree" label={t("app.btnTree")} />
        </VerticalMenu>
        <div className="col-md-8 text-center pull-right operations-list">
          <PageTitle title={t("families.searchTitle")} col={12} offset={0} />
          <SearchableList
            items={families}
            childPath="operations/family"
            label="label"
            searchUrl="/operations/families/search"
            autoFocus={true}
          />
        </div>
      </Row>
    </div>
  );
};
