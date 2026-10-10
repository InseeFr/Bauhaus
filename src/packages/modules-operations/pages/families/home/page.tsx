import { useTranslation } from "react-i18next";

import { TreeButton } from "@components/buttons/buttons-with-icons";
import { LoadingErrorBloc } from "@components/errors-bloc";
import { HomePageLayout } from "@components/home-page-layout";
import { Loading } from "@components/loading";
import { FeminineButton } from "@components/new-button";
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
    <HomePageLayout
      title={t("families.searchTitle")}
      menu={
        <VerticalMenu>
          <HasAccess module="OPERATION_FAMILY" privilege="CREATE">
            <FeminineButton action="/operations/families/create" />
          </HasAccess>
          <TreeButton wrapper={false} action="/operations/tree" label={t("app.btnTree")} />
        </VerticalMenu>
      }
    >
      <SearchableList
        items={families}
        childPath="operations/family"
        label="label"
        searchUrl="/operations/families/search"
        autoFocus={true}
      />
    </HomePageLayout>
  );
};
