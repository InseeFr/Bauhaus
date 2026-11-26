import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";

import { AppDevTools } from "@components/devtools/AppDevTools";
import { HomePageLayout } from "@components/home-page-layout";
import { Loading } from "@components/loading";
import { SearchableList } from "@components/searchable-list";
import { Toast } from "@components/ui/toast";

import { formatApiErrors } from "@utils/api-errors";
import { useTitle } from "@utils/hooks/useTitle";

import { appI18n } from "../../../../i18n";
import { useCreatePhysicalInstance } from "../../../hooks/useCreatePhysicalInstance";
import { usePhysicalInstances } from "../../../hooks/usePhysicalInstances";
import { errorToastTiming } from "../../../utils/error-toast";
import { formatDate } from "../../../utils/formatDate";
import { DdiToast } from "../../components/DdiToast/DdiToast";
import { NewFromDialog } from "../../components/NewFromDialog/NewFromDialog";
import {
  PhysicalInstanceDialog,
  PhysicalInstanceCreationData,
} from "../../components/PhysicalInstanceCreationDialog/PhysicalInstanceCreationDialog";
import { HomePageMenu } from "./menu";

/**
 * Modale ouverte, mémorisée dans l'URL (`?dialog=create` ou `?dialog=new-from`) : un lien partagé
 * ou un rechargement rouvre la même modale.
 */
const DIALOG_PARAM = "dialog";
type HomeDialog = "create" | "new-from";

export const Component = () => {
  const { t } = useTranslation();
  useTitle(t("ddi.title"), t("physicalInstance.pluralTitle"));
  const navigate = useNavigate();
  const { data = [], isLoading } = usePhysicalInstances();
  const createPhysicalInstance = useCreatePhysicalInstance();
  const [searchParams, setSearchParams] = useSearchParams();
  const openedDialog = searchParams.get(DIALOG_PARAM);
  const visible = openedDialog === "create";
  const newFromVisible = openedDialog === "new-from";

  const setOpenedDialog = (dialog: HomeDialog | null) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (dialog) next.set(DIALOG_PARAM, dialog);
      else next.delete(DIALOG_PARAM);
      return next;
    });
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

      void navigate(`/ddi/physical-instances/${result.agency}/${result.id}`, {
        replace: true,
      });
    } catch (err: unknown) {
      const errorMessage = formatApiErrors(
        err,
        appI18n,
        t("physicalInstance.creation.errorMessage"),
      ).join("\n");

      toast.current?.show({
        severity: "error",
        summary: t("physicalInstance.creation.errorTitle"),
        detail: errorMessage,
        ...errorToastTiming(),
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <HomePageLayout
        title={t("physicalInstance.homePageTitle")}
        menu={
          <HomePageMenu
            onCreate={() => setOpenedDialog("create")}
            onCreateFrom={() => setOpenedDialog("new-from")}
          />
        }
      >
        <SearchableList
          items={items}
          advancedSearch
          searchUrl="/ddi/physical-instances/search"
          childPath={(item: { agency: string }) => "ddi/physical-instances/" + item.agency}
          itemFormatter={(_content: any, item: any) => {
            return `${item.label} (${item.formattedVersionDate})`;
          }}
        />
      </HomePageLayout>

      <PhysicalInstanceDialog
        visible={visible}
        onHide={() => setOpenedDialog(null)}
        mode="create"
        onSubmitCreate={handleSubmit}
      />

      {/* Monté à l'ouverture seulement : la liste des sources n'est lue qu'à la demande. */}
      {newFromVisible && (
        <NewFromDialog visible={newFromVisible} onHide={() => setOpenedDialog(null)} />
      )}

      <DdiToast ref={toast} />
      <AppDevTools />
    </>
  );
};
