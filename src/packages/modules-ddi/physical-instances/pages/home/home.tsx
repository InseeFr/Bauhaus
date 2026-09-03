import { Row } from "@components/layout";
import { Loading } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";
import { AppDevTools } from "@components/devtools/AppDevTools";

import { useTitle } from "@utils/hooks/useTitle";
import { getApiErrorMessage } from "@utils/api-errors";

import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../utils/formatDate";
import { usePhysicalInstances } from "../../../hooks/usePhysicalInstances";
import { useCreatePhysicalInstance } from "../../../hooks/useCreatePhysicalInstance";
import { HomePageMenu } from "./menu";
import {
  PhysicalInstanceDialog,
  PhysicalInstanceCreationData,
} from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";

const TOAST_DURATION = 3000;

export const Component = () => {
  const { t } = useTranslation();
  useTitle(t("ddi.title"), t("physicalInstance.pluralTitle"));
  const navigate = useNavigate();
  const { data = [], isLoading } = usePhysicalInstances();
  const createPhysicalInstance = useCreatePhysicalInstance();
  const [visible, setVisible] = useState(false);
  const toast = useRef<Toast>(null);

  // SearchableList filtre sur les valeurs brutes des items, avant tout formatage : la versionDate
  // ISO ne permet donc pas de chercher une date au format affiché. On expose la date déjà formatée
  // pour que « 01/02/2026 » soit une recherche possible.
  const items = useMemo(
    () => data.map((item) => ({ ...item, formattedVersionDate: formatDate(item.versionDate) })),
    [data],
  );

  const handleSubmit = async (data: PhysicalInstanceCreationData) => {
    try {
      const result = await createPhysicalInstance.mutateAsync({
        physicalInstanceLabel: data.label,
        dataRelationshipLabel: data.dataRelationshipLabel,
        logicalRecordLabel: data.logicalRecordLabel,
        groupId: data.group.id,
        groupAgency: data.group.agency,
        studyUnitId: data.studyUnit.id,
        studyUnitAgency: data.studyUnit.agency,
      });

      setVisible(false);
      navigate(`/ddi/physical-instances/${result.agency}/${result.id}`, {
        replace: true,
      });
    } catch (err: unknown) {
      const errorMessage = getApiErrorMessage(err, t("physicalInstance.creation.errorMessage"));

      toast.current?.show({
        severity: "error",
        summary: t("physicalInstance.creation.errorTitle"),
        detail: errorMessage,
        life: TOAST_DURATION,
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container">
      <Row>
        <HomePageMenu onCreate={() => setVisible(true)} />
        <div className="col-md-8 text-center pull-right">
          <PageTitle title={t("physicalInstance.homePageTitle")} col={12} offset={0} />
          <SearchableList
            items={items}
            advancedSearch
            searchUrl="/ddi/physical-instances/search"
            childPath={(item: { agency: string }) => "ddi/physical-instances/" + item.agency}
            autoFocus
            itemFormatter={(_content: any, item: any) => {
              return `${item.label} (${item.formattedVersionDate})`;
            }}
          />
        </div>
      </Row>

      <PhysicalInstanceDialog
        visible={visible}
        onHide={() => setVisible(false)}
        mode="create"
        onSubmitCreate={handleSubmit}
      />

      <Toast ref={toast} />
      <AppDevTools />
    </div>
  );
};
