import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { ContributorsInput } from "@components/business/contributors-input/contributors-input";
import { CreatorsInput } from "@components/business/creators-input";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";
import { PageTitleBlock } from "@components/page-title-block";
import { Select } from "@components/select-rmes";

import { CodelistsApi } from "@sdk/index";

import { EMPTY_ARRAY } from "@utils/array-utils";

import "../../../../pages/codelists/edit/components/CodelistDetailEdit.css";
import { useDefaultContributor } from "@utils/creation/use-default-contributor";
import { useTitle } from "@utils/hooks/useTitle";

import { useAuthorizationGuard } from "../../../../../auth/components/auth";
import { partialInGlobalCodes } from "../../../../utils/partialInGlobalCodes";
import { validate } from "../validation";
import { Picker, PickerCode } from "./Picker";

/** Formulaire d'édition d'une liste de codes partielle : plus riche que le
 * modèle `Codelist` (dédié à l'écran des codes), il porte les métadonnées de
 * la fiche ainsi que la liste globale parente. */
interface PartialCodelistFormValues {
  id?: string;
  labelLg1?: string;
  labelLg2?: string;
  descriptionLg1?: string;
  descriptionLg2?: string;
  parentCode?: string;
  iriParent?: string;
  creator?: string;
  contributor?: string | string[];
  disseminationStatus?: string;
  codes?: Record<string, unknown>;
  created?: Date;
}

interface GlobalCodelistOption {
  value: string;
  label: string;
  iriParent: string;
}

interface PartialCodelistDetailEditTypes {
  codelist: PartialCodelistFormValues;
  handleSave: (codelist: PartialCodelistFormValues, parentCodes: PickerCode[]) => void;
  handleBack: VoidFunction;
  updateMode: boolean;
  globalCodelistOptions?: GlobalCodelistOption[];
  serverSideError?: unknown;
}

const defaultCodelist: PartialCodelistFormValues = {
  created: new Date(),
};

export const PartialCodelistDetailEdit = ({
  codelist: initialCodelist,
  handleSave,
  handleBack,
  updateMode,
  globalCodelistOptions = EMPTY_ARRAY,
  serverSideError,
}: Readonly<PartialCodelistDetailEditTypes>) => {
  const { t } = useTranslation();

  const [codelist, setCodelist] = useState<PartialCodelistFormValues>(defaultCodelist);

  const [parentCodes, setParentCodes] = useState<PickerCode[]>([]);

  const [clientSideErrors, setClientSideErrors] = useState<{
    fields?: Record<string, string>;
    errorMessage?: string[];
  }>({});

  const [submitting, setSubmitting] = useState(false);

  useTitle(t("partial-codelists.pluralTitle"), codelist?.labelLg1);

  const resetErrorsMessages = () =>
    setClientSideErrors({
      ...clientSideErrors,
      errorMessage: [],
    });

  const handleParentCode = useCallback(
    (code: string) => {
      CodelistsApi.getCodelistCodes(code, 1, 0).then((codes: any) => {
        const globalWithPartialCodes =
          partialInGlobalCodes(
            Object.values(codes.items || {}),
            Object.values(codelist.codes || {}) as any,
          ) || [];
        setParentCodes(globalWithPartialCodes);
      });
    },
    [codelist.codes],
  );

  const handleParent = useCallback(
    (value: string) => {
      setCodelist({
        ...codelist,
        parentCode: value,
        iriParent: globalCodelistOptions?.find((parentCL) => parentCL.value === value)?.iriParent,
      });
      resetErrorsMessages();
      handleParentCode(value);
    },
    [codelist, handleParentCode, globalCodelistOptions],
  );

  const isContributor = useAuthorizationGuard({
    module: "CODESLIST_PARTIALCODESLIST",
    privilege: "CREATE",
  });

  const defaultContributor = useDefaultContributor(isContributor);

  useEffect(() => {
    let codelist = { ...initialCodelist, ...defaultCodelist };

    if (!codelist.id) {
      codelist.contributor = defaultContributor;
    }

    setCodelist(codelist);
    if (initialCodelist.parentCode) {
      handleParentCode(initialCodelist.parentCode);
    } else {
      setParentCodes([]);
    }
  }, [initialCodelist, defaultContributor, handleParentCode]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      resetErrorsMessages();
      setCodelist({
        ...codelist,
        [name]: value,
      });
    },
    [clientSideErrors, codelist],
  );

  const addAllClickHandler = useCallback(() => {
    const selectedParents = parentCodes.map((c) => {
      return { ...c, isPartial: true };
    });
    setParentCodes(selectedParents);
  }, [parentCodes]);

  const removeAllClickHandler = useCallback(() => {
    const unselectedParents = parentCodes.map((c) => {
      return { ...c, isPartial: false };
    });
    setParentCodes(unselectedParents);
  }, [parentCodes]);

  const addClickHandler = useCallback(
    (currentCode: string) => {
      setParentCodes(
        parentCodes.map((c) => {
          if (c.code === currentCode) {
            return { ...c, isPartial: true };
          }
          return c;
        }),
      );
    },
    [parentCodes],
  );

  const removeClickHandler = useCallback(
    (currentCode: string) => {
      setParentCodes(
        parentCodes.map((c) => {
          if (c.code === currentCode) {
            return { ...c, isPartial: false };
          }
          return c;
        }),
      );
    },
    [parentCodes],
  );

  const handleSaveClick = useCallback(() => {
    const clientSideErrors = validate(codelist);
    if (clientSideErrors.errorMessage?.length > 0) {
      setSubmitting(true);
      setClientSideErrors(clientSideErrors);
    } else {
      setClientSideErrors({});
      handleSave(codelist, parentCodes);
    }
  }, [codelist, parentCodes, handleSave]);

  return (
    <>
      {updateMode ? (
        <PageTitleBlock titleLg1={codelist.labelLg1} titleLg2={codelist.labelLg2} />
      ) : (
        <PageTitle title={t("partial-codelists.creationPageTitle")} />
      )}
      <ActionToolbar>
        <CancelButton action={handleBack} />
        <SaveButton
          disabled={(clientSideErrors.errorMessage?.length ?? 0) > 0}
          action={handleSaveClick}
        />
      </ActionToolbar>
      {submitting && clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={clientSideErrors.errorMessage} />
      )}
      {serverSideError && <ErrorBloc error={serverSideError} />}
      <form>
        <Row>
          <div className="col-md-12 form-group">
            <LabelRequired htmlFor="id">{t("partial-codelists.identifier")}</LabelRequired>
            <TextInput
              id="id"
              name="id"
              value={codelist.id || ""}
              onChange={handleChange}
              disabled={updateMode}
              aria-invalid={!!clientSideErrors.fields?.id}
              aria-describedby={clientSideErrors.fields?.id ? "id-error" : undefined}
            />
            <ClientSideError id="id-error" error={clientSideErrors?.fields?.id}></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="col-md-12 form-group">
            <LabelRequired htmlFor="parentCode">
              {t("partial-codelists.parentCodelist")}
            </LabelRequired>
            <Select
              placeholder={t("partial-codelists.parentCodelistPlaceholder")}
              value={codelist.parentCode}
              options={globalCodelistOptions}
              onChange={handleParent}
              disabled={updateMode}
            />
            <ClientSideError
              id="parentCode-error"
              error={clientSideErrors?.fields?.parentCode}
            ></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="labelLg1">
              {t("partial-codelists.label", { lng: "fr" })}
            </LabelRequired>
            <TextInput
              id="labelLg1"
              name="labelLg1"
              onChange={handleChange}
              value={codelist.labelLg1 || ""}
              aria-invalid={!!clientSideErrors.fields?.labelLg1}
              aria-describedby={clientSideErrors.fields?.labelLg1 ? "labelLg1-error" : undefined}
            />
            <ClientSideError
              id="labelLg1-error"
              error={clientSideErrors?.fields?.labelLg1}
            ></ClientSideError>
          </div>
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="labelLg2">
              {t("partial-codelists.label", { lng: "en" })}
            </LabelRequired>
            <TextInput
              id="labelLg2"
              name="labelLg2"
              onChange={handleChange}
              value={codelist.labelLg2 || ""}
              aria-invalid={!!clientSideErrors.fields?.labelLg2}
              aria-describedby={clientSideErrors.fields?.labelLg2 ? "labelLg2-error" : undefined}
            />
            <ClientSideError
              id="labelLg2-error"
              error={clientSideErrors?.fields?.labelLg2}
            ></ClientSideError>
          </div>
        </Row>
        <div className="form-group">
          <CreatorsInput
            value={codelist.creator ?? ""}
            onChange={(value) => {
              setCodelist({ ...codelist, creator: value as string });
              setClientSideErrors({
                ...clientSideErrors,
                errorMessage: [],
              });
            }}
          />
          <ClientSideError
            id="creator-error"
            error={clientSideErrors?.fields?.creator}
          ></ClientSideError>
        </div>
        <div className="form-group">
          <ContributorsInput
            multi
            value={codelist.contributor ?? []}
            onChange={(values) => setCodelist({ ...codelist, contributor: values })}
          />
        </div>
        <div className="form-group">
          <DisseminationStatusInput
            value={codelist.disseminationStatus ?? ""}
            handleChange={(value) => {
              setCodelist({ ...codelist, disseminationStatus: value });
              setClientSideErrors({
                ...clientSideErrors,
                errorMessage: [],
              });
            }}
            required
          />
          <ClientSideError
            id="disseminationStatus-error"
            error={clientSideErrors?.fields?.disseminationStatus}
          ></ClientSideError>
        </div>
        <Row>
          <div className="col-md-6 form-group">
            <label htmlFor="descriptionLg1">
              {t("partial-codelists.description", { lng: "fr" })}
            </label>
            <textarea
              value={codelist.descriptionLg1}
              className="form-control"
              id="descriptionLg1"
              name="descriptionLg1"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="descriptionLg2">
              {t("partial-codelists.description", { lng: "en" })}
            </label>
            <textarea
              value={codelist.descriptionLg2}
              className="form-control"
              id="descriptionLg2"
              name="descriptionLg2"
              onChange={handleChange}
            />
          </div>
        </Row>
        <div>
          {parentCodes && (
            <Picker
              panelTitle={t("partial-codelists.title")}
              codes={parentCodes}
              addAll={addAllClickHandler}
              removeAll={removeAllClickHandler}
              addAction={addClickHandler}
              removeAction={removeClickHandler}
            />
          )}
        </div>
      </form>
    </>
  );
};
