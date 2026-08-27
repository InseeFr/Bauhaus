import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { Loading, Saving } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { PageTitleBlock } from "@components/page-title-block";

import { DatasetsApi } from "@sdk/index";

import { initializeContributorProperty } from "@utils/creation/contributor-init";
import { useDefaultContributor } from "@utils/creation/use-default-contributor";
import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import "./page.css";
import { LayoutWithLateralMenu } from "./components/LayoutWithLateralMenu";
import { GlobalInformation } from "./components/GlobalInformation";
import { InternalManagement } from "./components/InternalManagement";
import { Notes } from "./components/Notes";
import { StatisticalInformation } from "./components/StatisticalInformation";
import { validate } from "./validation";
import { useAuthorizationGuard } from "../../../../auth/components/auth";
import { useDataset } from "../../../hooks/useDataset";

export const Component = () => {
  const { t } = useTranslation();

  const { id } = useParams();
  const isEditing = !!id;

  const goBack = useGoBack();

  const [editingDataset, setEditingDataset] = useState({});
  const [clientSideErrors, setClientSideErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const hasErrors = (keys) => {
    const fieldsInError = keys.filter((key) => clientSideErrors.fields?.[key]);
    return fieldsInError.length > 0;
  };

  const { data: dataset, status } = useDataset(id);

  const isContributor = useAuthorizationGuard("DATASET_DATASET", "CREATE");
  const defaultContributor = useDefaultContributor(isContributor);
  useEffect(() => {
    if (status === "success") {
      setEditingDataset(dataset);
    } else if (isContributor && !id) {
      setEditingDataset({
        catalogRecord: {
          ...initializeContributorProperty(isContributor, !id, defaultContributor),
        },
      });
    }
  }, [status, dataset, id, isContributor, defaultContributor]);

  const queryClient = useQueryClient();

  const {
    isPending: isSaving,
    mutate: save,
    error: serverSideError,
  } = useMutation({
    mutationFn: () => {
      const formattedDataset = { themes: [], ...editingDataset };
      if (isEditing) {
        return DatasetsApi.putDataset(formattedDataset);
      }
      return DatasetsApi.postDataset(formattedDataset);
    },

    onSuccess: (id = editingDataset.id) => {
      if (isEditing) {
        queryClient.invalidateQueries(["datasets", id]);
      }
      queryClient.invalidateQueries(["datasets"]);

      goBack(`/datasets/${id}`, !isEditing);
    },
  });

  useTitle(t("dataset.pluralTitle"), editingDataset?.labelLg1);

  if (!editingDataset.id && isEditing) {
    return <Loading />;
  }

  if (isSaving) {
    return <Saving />;
  }

  const layoutConfiguration = {
    globalInformation: {
      title: t("dataset.globalInformation.title"),
      hasError: hasErrors(["labelLg1", "labelLg2"]),
      content: () => {
        if (editingDataset?.updated?.includes("T")) {
          editingDataset.updated = editingDataset.updated.substring(
            0,
            editingDataset.updated.indexOf("T"),
          );
        }
        if (editingDataset?.issued?.includes("T")) {
          editingDataset.issued = editingDataset.issued.substring(
            0,
            editingDataset.issued.indexOf("T"),
          );
        }
        return (
          <GlobalInformation
            editingDataset={editingDataset}
            setEditingDataset={setEditingDataset}
            clientSideErrors={clientSideErrors}
            setClientSideErrors={setClientSideErrors}
          />
        );
      },
    },
    internalManagement: {
      title: t("dataset.internalManagement.title"),
      hasError: hasErrors([
        "contributor",
        "creator",
        "disseminationStatus",
        "idSerie",
        "altIdentifier",
      ]),
      content: () => (
        <InternalManagement
          editingDataset={editingDataset}
          setEditingDataset={setEditingDataset}
          clientSideErrors={clientSideErrors}
          setClientSideErrors={setClientSideErrors}
        />
      ),
    },
    notes: {
      title: t("dataset.notes.title"),
      content: () => (
        <Notes editingDataset={editingDataset} setEditingDataset={setEditingDataset} />
      ),
    },
    statisticalInformation: {
      title: t("dataset.statisticalInformation.title"),
      content: () => (
        <StatisticalInformation
          editingDataset={editingDataset}
          setEditingDataset={setEditingDataset}
          clientSideErrors={clientSideErrors}
        />
      ),
    },
  };

  const onSubmit = () => {
    const clientSideErrors = validate(editingDataset);
    if (clientSideErrors.errorMessage?.length > 0) {
      setSubmitting(true);
      setClientSideErrors(clientSideErrors);
    } else {
      setClientSideErrors({});
      save(editingDataset);
    }
  };

  return (
    <div className="container editor-container dataset-container">
      {isEditing ? (
        <PageTitleBlock titleLg1={dataset.labelLg1} titleLg2={dataset.labelLg2} />
      ) : (
        <PageTitle title={t("dataset.creationPageTitle")} />
      )}
      <ActionToolbar>
        <CancelButton action={() => goBack("/datasets")} />
        <SaveButton action={onSubmit} disabled={clientSideErrors.errorMessage?.length > 0} />
      </ActionToolbar>
      {submitting && clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={clientSideErrors.errorMessage} />
      )}
      <ErrorBloc error={[serverSideError]} />
      <form>
        <LayoutWithLateralMenu layoutConfiguration={layoutConfiguration}>
          {(key) => layoutConfiguration[key].content()}
        </LayoutWithLateralMenu>
      </form>
    </div>
  );
};
