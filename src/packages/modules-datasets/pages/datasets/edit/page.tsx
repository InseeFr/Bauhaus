import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router";

import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { ErrorBloc, GlobalClientSideErrorBloc, LoadingErrorBloc } from "@components/errors-bloc";
import { Loading, Saving } from "@components/loading";
import { PageTitle } from "@components/page-title";
import { PageTitleBlock } from "@components/page-title-block";

import { Dataset } from "@model/Dataset";

import { DatasetsApi } from "@sdk/index";

import { toFormErrors } from "@utils/api-errors";
import { initializeContributorProperty } from "@utils/creation/contributor-init";
import { useDefaultContributor } from "@utils/creation/use-default-contributor";
import { useGoBack } from "@utils/hooks/useGoBack";
import { useTitle } from "@utils/hooks/useTitle";

import "./page.css";
import { useAuthorizationGuard } from "../../../../auth/components/auth";
import { useDataset } from "../../../hooks/useDataset";
import { buildDuplicatedDataset } from "./buildDuplicatedDataset";
import { GlobalInformation } from "./components/GlobalInformation";
import { InternalManagement } from "./components/InternalManagement";
import { LayoutItemConfiguration, LayoutWithLateralMenu } from "./components/LayoutWithLateralMenu";
import { Lineage } from "./components/Lineage";
import { Notes } from "./components/Notes";
import { StatisticalInformation } from "./components/StatisticalInformation";
import { validate } from "./validation";

interface DatasetEditLayoutItem extends LayoutItemConfiguration {
  content: ReactNode;
}

type DatasetEditLayoutConfiguration = Record<string, DatasetEditLayoutItem>;

type ClientSideErrors = {
  errorMessage?: string[];
  fields?: Record<string, string>;
};

/** Champs dont une erreur renvoyée par le serveur s'affiche sous la saisie. */
const FIELDS_WITH_ERROR_SLOT = [
  "labelLg1",
  "labelLg2",
  "altIdentifier",
  "creator",
  "contributor",
  "disseminationStatus",
];

/**
 * Le back nomme les champs du `catalogRecord` par leur chemin dans le corps, le formulaire par leur
 * seul nom (voir `validation.ts`).
 */
const FORM_FIELD_BY_SERVER_FIELD: Record<string, string> = {
  "catalogRecord.creator": "creator",
  "catalogRecord.contributor": "contributor",
};

const withFormFieldNames = (err: unknown): unknown => {
  const errors = (err as { errors?: unknown } | null)?.errors;
  if (!Array.isArray(errors)) return err;

  return {
    ...(err as object),
    errors: errors.map((error: { field?: unknown }) =>
      typeof error?.field === "string" && error.field in FORM_FIELD_BY_SERVER_FIELD
        ? { ...error, field: FORM_FIELD_BY_SERVER_FIELD[error.field] }
        : error,
    ),
  };
};

export const Component = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const isDuplicating = useLocation().pathname.endsWith("/duplicate");
  const isEditing = !!id && !isDuplicating;

  const goBack = useGoBack();

  const [editingDataset, setEditingDataset] = useState<Dataset>({} as Dataset);

  const [clientSideErrors, setClientSideErrors] = useState<ClientSideErrors>({});

  const [submitting, setSubmitting] = useState(false);

  const [serverSideError, setServerSideError] = useState<unknown>();

  const hasErrors = (keys: string[]) => {
    const fieldsInError = keys.filter((key) => clientSideErrors.fields?.[key]);
    return fieldsInError.length > 0;
  };

  const { data: dataset, status, error: loadError } = useDataset(id);

  const isContributor = useAuthorizationGuard({
    module: "DATASET_DATASET",
    privilege: "CREATE",
  });

  const defaultContributor = useDefaultContributor(isContributor);
  useEffect(() => {
    if (status === "success") {
      setEditingDataset((isDuplicating ? buildDuplicatedDataset(dataset) : dataset) as Dataset);
    } else if (isContributor && !id) {
      setEditingDataset({
        catalogRecord: {
          ...initializeContributorProperty(isContributor, !id, defaultContributor),
        },
      } as Dataset);
    }
  }, [status, dataset, id, isDuplicating, isContributor, defaultContributor]);

  const queryClient = useQueryClient();

  const { isPending: isSaving, mutate: save } = useMutation({
    meta: { globalErrorToast: false },
    mutationFn: () => {
      const formattedDataset = {
        ...editingDataset,
        themes: editingDataset.themes ?? [],
      };
      if (isEditing) {
        return DatasetsApi.putDataset(formattedDataset);
      }
      return DatasetsApi.postDataset(formattedDataset);
    },
    onSuccess: (id = editingDataset.id) => {
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["datasets", id] });
      }
      queryClient.invalidateQueries({ queryKey: ["datasets"] });

      goBack(`/datasets/${id}`, !isEditing);
    },
    onError: (err) => {
      const formErrors = toFormErrors(withFormFieldNames(err), FIELDS_WITH_ERROR_SLOT);
      setSubmitting(true);
      setClientSideErrors(formErrors.clientSideErrors ?? {});
      setServerSideError(formErrors.serverSideError);
    },
  });

  useTitle(t("dataset.pluralTitle"), editingDataset?.labelLg1);

  if (loadError && !dataset) {
    return <LoadingErrorBloc error={loadError} />;
  }

  if ((!editingDataset.id && isEditing) || (isDuplicating && status !== "success")) {
    return <Loading />;
  }

  if (isSaving) {
    return <Saving />;
  }

  const layoutConfiguration: DatasetEditLayoutConfiguration = {
    globalInformation: {
      title: t("dataset.globalInformation.title"),
      hasError: hasErrors(["labelLg1", "labelLg2"]),
      content: (
        <GlobalInformation
          editingDataset={editingDataset}
          setEditingDataset={setEditingDataset}
          clientSideErrors={clientSideErrors}
          setClientSideErrors={setClientSideErrors}
        />
      ),
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
      content: (
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
      content: <Notes editingDataset={editingDataset} setEditingDataset={setEditingDataset} />,
    },
    statisticalInformation: {
      title: t("dataset.statisticalInformation.title"),
      content: (
        <StatisticalInformation
          editingDataset={editingDataset}
          setEditingDataset={setEditingDataset}
          clientSideErrors={clientSideErrors}
        />
      ),
    },
    lineage: {
      title: t("dataset.lineage.title"),
      content: <Lineage editingDataset={editingDataset} setEditingDataset={setEditingDataset} />,
    },
  };

  const onSubmit = () => {
    const clientSideErrors = validate(editingDataset);
    if (clientSideErrors.errorMessage?.length > 0) {
      setSubmitting(true);
      setClientSideErrors(clientSideErrors);
    } else {
      setClientSideErrors({});
      setServerSideError(undefined);
      save();
    }
  };

  return (
    <div className="container editor-container dataset-container">
      {isEditing && <PageTitleBlock titleLg1={dataset.labelLg1} titleLg2={dataset.labelLg2} />}
      {isDuplicating && <PageTitle title={t("dataset.duplicationPageTitle") + dataset.labelLg1} />}
      {!isEditing && !isDuplicating && <PageTitle title={t("dataset.creationPageTitle")} />}
      <ActionToolbar>
        <CancelButton action={() => goBack("/datasets")} />
        <SaveButton action={onSubmit} disabled={(clientSideErrors.errorMessage?.length ?? 0) > 0} />
      </ActionToolbar>
      {submitting && clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={clientSideErrors.errorMessage} />
      )}
      <ErrorBloc error={serverSideError} />
      <form>
        <LayoutWithLateralMenu layoutConfiguration={layoutConfiguration}>
          {(key) => layoutConfiguration[key].content}
        </LayoutWithLateralMenu>
      </form>
    </div>
  );
};
