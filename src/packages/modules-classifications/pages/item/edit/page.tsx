import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";

import { ClientSideError, ErrorBloc, LoadingErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Loading, Saving } from "@components/loading";
import { PageTitleBlock } from "@components/page-title-block";
import { Select } from "@components/select-rmes";

import { ClassificationsApi } from "@sdk/classification";

import { toFormErrors } from "@utils/api-errors";

import {
  useClassificationItem,
  useClassificationParentLevels,
} from "../../../hooks/useClassificationItem";
import { NotesInputs } from "./components/NotesInputs";
import { Menu } from "./menu";
import { shortLabelField, validate } from "./validation";

/** Champs qui affichent leur erreur sous la saisie ; les autres erreurs du back vont au bandeau. */
const FIELDS_WITH_ERROR_SLOT = ["prefLabelLg1", "prefLabelLg2"] as const;

export const Component = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const { classificationId = "", itemId = "" } = useParams<{
    classificationId: string;
    itemId: string;
  }>();

  const {
    isPending: isSaving,
    mutate: save,
    isSuccess: isSavingSuccess,
  } = useMutation({
    mutationFn: (general: any) => {
      return ClassificationsApi.putClassificationItemGeneral(classificationId, itemId, general);
    },
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["classifications-item", classificationId, itemId],
      });
    },
    onError: (err) => {
      const formErrors = toFormErrors(err, FIELDS_WITH_ERROR_SLOT);
      setSubmitting(true);
      setClientSideErrors(formErrors.clientSideErrors ?? {});
      setServerSideError(formErrors.serverSideError);
    },
  });

  const {
    isLoading,
    item,
    status,
    error: loadError,
  } = useClassificationItem(classificationId, itemId, true);

  const { data: previousLevels = [], isPending: isPreviousLevelsLoading } =
    useClassificationParentLevels(classificationId, itemId, item);

  const previousLevelsOptions = Array.isArray(previousLevels)
    ? previousLevels.map((previousLevel: any) => ({
        value: previousLevel.item,
        label: previousLevel.labelLg1,
      }))
    : [];

  const [value, setValue] = useState<any>(item);

  useEffect(() => {
    if (status === "success" && !value.general) {
      setValue(item);
    }
  }, [status, item]);

  const [clientSideErrors, setClientSideErrors] = useState<any>({});

  const [submitting, setSubmitting] = useState(false);

  // Un enregistrement a été refusé par la validation : chaque saisie revalide le formulaire.
  const [saveAttempted, setSaveAttempted] = useState(false);

  const [serverSideError, setServerSideError] = useState<unknown>();

  if (loadError && !item?.general) return <LoadingErrorBloc error={loadError} />;

  if (isLoading || isPreviousLevelsLoading) return <Loading />;

  if (isSaving) return <Saving />;

  const { general, notes } = value;

  const formatAndSave = (value: any) => {
    queryClient.setQueriesData(
      { queryKey: ["classifications-item", classificationId, itemId] },
      {},
    );
    save({ ...general, ...notes, ...value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const clientSideErrors = validate(value.general);
    if (clientSideErrors.errorMessage?.length > 0) {
      setSubmitting(true);
      setSaveAttempted(true);
      setClientSideErrors(clientSideErrors);
    } else {
      setClientSideErrors({});
      setServerSideError(undefined);
      formatAndSave(value);
    }
  };

  if (isSavingSuccess) {
    return (
      <Navigate
        to={"/classifications/classification/" + classificationId + "/item/" + itemId}
        replace
      />
    );
  }

  if (!value?.general) {
    return;
  }

  const updateValue = (next: any) => {
    setValue(next);
    if (saveAttempted) {
      setClientSideErrors(validate(next.general));
    }
  };

  // Avant une tentative d'enregistrement, saisir un intitulé lève la désactivation du bouton.
  const clearErrorMessage = () => {
    if (saveAttempted) return;
    setClientSideErrors((clientSideErrors: any) => ({
      ...clientSideErrors,
      errorMessage: [],
    }));
  };

  return (
    <div className="container editor-container">
      <PageTitleBlock titleLg1={general?.prefLabelLg1} titleLg2={general?.prefLabelLg2} />
      <form onSubmit={onSubmit}>
        <Menu disabled={clientSideErrors.errorMessage?.length > 0} />
        {submitting && clientSideErrors && <ErrorBloc error={clientSideErrors.errorMessage} />}
        <ErrorBloc error={serverSideError} />
        <Row>
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="prefLabelLg1">{t("item.title", { lng: "fr" })}</LabelRequired>
            <TextInput
              id="prefLabelLg1"
              aria-describedby="prefLabelLg1-error"
              aria-invalid={!!clientSideErrors?.fields?.prefLabelLg1}
              value={general.prefLabelLg1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateValue({
                  ...value,
                  general: { ...value.general, prefLabelLg1: e.target.value },
                });
                clearErrorMessage();
              }}
            />
            <ClientSideError
              id="prefLabelLg1-error"
              error={clientSideErrors?.fields?.prefLabelLg1}
            ></ClientSideError>
          </div>
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="prefLabelLg2">{t("item.title", { lng: "en" })}</LabelRequired>
            <TextInput
              id="prefLabelLg2"
              aria-describedby="prefLabelLg2-error"
              aria-invalid={!!clientSideErrors?.fields?.prefLabelLg2}
              value={general.prefLabelLg2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                updateValue({
                  ...value,
                  general: { ...value.general, prefLabelLg2: e.target.value },
                });
                clearErrorMessage();
              }}
            />
            <ClientSideError
              id="prefLabelLg2-error"
              error={clientSideErrors?.fields?.prefLabelLg2}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="form-group col-md-6">
            <label htmlFor="altLabelLg1">{t("item.altLabel", { lng: "fr" })}</label>
            <TextInput
              id="altLabelLg1"
              value={general.altLabelLg1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateValue({
                  ...value,
                  general: { ...value.general, altLabelLg1: e.target.value },
                })
              }
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="altLabelLg2">{t("item.altLabel", { lng: "en" })}</label>
            <TextInput
              id="altLabelLg2"
              value={general.altLabelLg2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateValue({
                  ...value,
                  general: { ...value.general, altLabelLg2: e.target.value },
                })
              }
            />
          </div>
        </Row>
        <div className="form-group">
          <label>{t("item.broaderLevel")}</label>
          <Select
            value={general.broaderURI}
            options={previousLevelsOptions}
            onChange={(v: string) =>
              updateValue({
                ...value,
                general: { ...value.general, broaderURI: v },
              })
            }
            unclearable
          />
        </div>
        {general.altLabels?.map(({ length, shortLabelLg1, shortLabelLg2 }: any, index: number) => {
          const updateShortLabel = (field: "shortLabelLg1" | "shortLabelLg2", label: string) =>
            updateValue({
              ...value,
              general: {
                ...value.general,
                altLabels: value.general.altLabels.map((altLabel: any, i: number) =>
                  i === index ? { ...altLabel, [field]: label } : altLabel,
                ),
              },
            });
          const idLg1 = shortLabelField("Lg1", length);
          const idLg2 = shortLabelField("Lg2", length);
          return (
            <Row key={index}>
              <div className="form-group col-md-6">
                <label htmlFor={idLg1}>{t("item.altLabelWithLength", { length, lng: "fr" })}</label>
                <TextInput
                  id={idLg1}
                  value={shortLabelLg1}
                  aria-describedby={`${idLg1}-error`}
                  aria-invalid={!!clientSideErrors?.fields?.[idLg1]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateShortLabel("shortLabelLg1", e.target.value)
                  }
                />
                <ClientSideError
                  id={`${idLg1}-error`}
                  error={clientSideErrors?.fields?.[idLg1]}
                ></ClientSideError>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor={idLg2}>{t("item.altLabelWithLength", { length, lng: "en" })}</label>
                <TextInput
                  id={idLg2}
                  value={shortLabelLg2}
                  aria-describedby={`${idLg2}-error`}
                  aria-invalid={!!clientSideErrors?.fields?.[idLg2]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateShortLabel("shortLabelLg2", e.target.value)
                  }
                />
                <ClientSideError
                  id={`${idLg2}-error`}
                  error={clientSideErrors?.fields?.[idLg2]}
                ></ClientSideError>
              </div>
            </Row>
          );
        })}
        <NotesInputs
          value={notes}
          onChange={(v) => {
            updateValue({
              ...value,
              notes: {
                ...value.notes,
                ...v,
              },
            });
          }}
        />
      </form>
    </div>
  );
};
