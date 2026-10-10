import { useTranslation } from "react-i18next";

import { TreeButton } from "@components/buttons/buttons-with-icons";
import { HomePageLayout } from "@components/home-page-layout";
import { FeminineButton } from "@components/new-button";
import { SearchableList } from "@components/searchable-list";
import { VerticalMenu } from "@components/vertical-menu";

import { Operation } from "@model/Operation";

import { useTitle } from "@utils/hooks/useTitle";

import { HasAccess } from "../../../../../auth/components/auth";

interface OperationsHomeTypes {
  operations: Operation[];
}

export function OperationsHome({ operations }: Readonly<OperationsHomeTypes>) {
  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), t("common.operationsTitle"));

  return (
    <HomePageLayout
      title={t("operations.searchTitle")}
      menu={
        <VerticalMenu>
          <HasAccess module="OPERATION_OPERATION" privilege="CREATE">
            <FeminineButton action="/operations/operation/create" />
          </HasAccess>
          <TreeButton wrapper={false} action="/operations/tree" label={t("app.btnTree")} />
        </VerticalMenu>
      }
    >
      <SearchableList
        items={operations}
        childPath={"operations/operation"}
        label="label"
        autoFocus={true}
      />
    </HomePageLayout>
  );
}
