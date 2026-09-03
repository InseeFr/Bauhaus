import { TreeButton } from "@components/buttons/buttons-with-icons";
import { Row } from "@components/layout";
import { FeminineButton } from "@components/new-button";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";
import { VerticalMenu } from "@components/vertical-menu";

import { useTitle } from "@utils/hooks/useTitle";

import { useTranslation } from "react-i18next";

import { HasAccess } from "../../../../../auth/components/auth";

export function OperationsHome({ operations }) {
  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), t("common.operationsTitle"));

  return (
    <div className="container">
      <Row>
        <VerticalMenu>
          <HasAccess module="OPERATION_OPERATION" privilege="CREATE">
            <FeminineButton action="/operations/operation/create" />
          </HasAccess>
          <TreeButton wrapper={false} action="/operations/tree" label={t("app.btnTree")} />
        </VerticalMenu>
        <div className="col-md-8 text-center pull-right operations-list">
          <PageTitle title={t("operations.searchTitle")} col={12} offset={0} />
          <SearchableList
            items={operations}
            childPath={"operations/operation"}
            label="label"
            advancedSearch={false}
            autoFocus={true}
          />
        </div>
      </Row>
    </div>
  );
}
