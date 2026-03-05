import dayjs from "dayjs";
import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ActionToolbar } from "@components/action-toolbar";
import { CancelButton, SaveButton } from "@components/buttons/buttons-with-icons";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import LabelRequired from "@components/label-required";
import { Row } from "@components/layout";

import { useTitle } from "@utils/hooks/useTitle";

import { validate } from "../validation";
import { CodesPanel } from "../../../../components/CodesPanel";
import "./CodelistDetailEdit.css";
import { UriInputGroup } from "./UriInputGroup";
import { CreatorsInput } from "@components/business/creators-input";
import { ContributorsInput } from "@components/business/contributors-input/contributors-input";
import { useAuthorizationGuard } from "../../../../../auth/components/auth";
import { useUserStamps } from "@utils/hooks/users";

const defaultCodelist = {
  created: dayjs(),
};

export const CodelistDetailEdit = ({
  codelist: initialCodelist,
  handleSave,
  handleBack,
  updateMode,
  serverSideError,
}) => {
  const { t } = useTranslation();

  const [codelist, setCodelist] = useState(defaultCodelist);

  const [clientSideErrors, setClientSideErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  useTitle(t("codelists.pluralTitle"), codelist?.labelLg1);

  const { data: stamps } = useUserStamps();
  const stamp = stamps[0]?.stamp;
  const isContributor = useAuthorizationGuard("CODESLIST_CODESLIST", "CREATE");

  useEffect(() => {
    let codesList = { ...initialCodelist, ...defaultCodelist };
    if (!codesList.id) {
      codesList.contributor = isContributor ? [stamp] : ["DG75-L201"];
    }
    setCodelist(codesList);
  }, [initialCodelist, isContributor, stamp]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setClientSideErrors({
        ...clientSideErrors,
        errorMessage: [],
      });
      setCodelist({
        ...codelist,
        [name]: value,
      });
    },
    [clientSideErrors, codelist],
  );

  const handleSaveClick = useCallback(() => {
    const clientSideErrors = validate(codelist);
    if (clientSideErrors.errorMessage?.length > 0) {
      setSubmitting(true);
      setClientSideErrors(clientSideErrors);
    } else {
      setClientSideErrors({});
      handleSave(codelist);
    }
  }, [codelist, handleSave]);

  return (
    <>
      <ActionToolbar>
        <CancelButton action={handleBack} col={3} />
        <SaveButton
          disabled={clientSideErrors.errorMessage?.length > 0}
          action={handleSaveClick}
          col={3}
        />
      </ActionToolbar>
      {submitting && clientSideErrors && (
        <GlobalClientSideErrorBloc clientSideErrors={clientSideErrors.errorMessage} />
      )}
      {serverSideError && <ErrorBloc error={serverSideError} />}
      <form>
        <Row>
          <UriInputGroup
            id="lastListUriSegment"
            name="lastListUriSegment"
            label={t("codelists.codelistURI")}
            prefix="http://rdf.insee.fr/codes/"
            value={codelist.lastListUriSegment || ""}
            onChange={handleChange}
            disabled={updateMode && codelist.lastListUriSegment !== ""}
            error={clientSideErrors?.fields?.lastListUriSegment}
          />
        </Row>
        <Row>
          <UriInputGroup
            id="lastCodeUriSegment"
            name="lastCodeUriSegment"
            label={t("codelists.codesURI")}
            prefix="http://rdf.insee.fr/codes/"
            value={codelist.lastCodeUriSegment || ""}
            onChange={handleChange}
            disabled={updateMode && codelist.lastCodeUriSegment !== ""}
            error={clientSideErrors?.fields?.lastCodeUriSegment}
          />
        </Row>
        <Row>
          <UriInputGroup
            id="lastClassUriSegment"
            name="lastClassUriSegment"
            label={t("codelists.classURI")}
            prefix="http://rdf.insee.fr/codes/concept/"
            value={codelist.lastClassUriSegment || ""}
            onChange={handleChange}
            disabled={updateMode && codelist.lastClassUriSegment !== ""}
            error={clientSideErrors?.fields?.lastClassUriSegment}
          />
        </Row>
        <Row>
          <div className="col-md-12 form-group">
            <LabelRequired htmlFor="id">{t("codelists.identifier")}</LabelRequired>
            <TextInput
              id="id"
              name="id"
              value={codelist.id || ""}
              onChange={handleChange}
              aria-invalid={!!clientSideErrors.fields?.id}
              aria-describedby={clientSideErrors.fields?.id ? "id-error" : null}
            />
            <ClientSideError id="id-error" error={clientSideErrors?.fields?.id}></ClientSideError>
          </div>
        </Row>
        <Row>
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="labelLg1">{t("codelists.label", { lng: "fr" })}</LabelRequired>
            <TextInput
              id="labelLg1"
              name="labelLg1"
              onChange={handleChange}
              value={codelist.labelLg1 || ""}
              aria-invalid={!!clientSideErrors.fields?.labelLg1}
              aria-describedby={clientSideErrors.fields?.labelLg1 ? "labelLg1-error" : null}
            />
            <ClientSideError
              id="labelLg1-error"
              error={clientSideErrors?.fields?.labelLg1}
            ></ClientSideError>
          </div>
          <div className="col-md-6 form-group">
            <LabelRequired htmlFor="labelLg2">{t("codelists.label", { lng: "en" })}</LabelRequired>
            <TextInput
              id="labelLg2"
              name="labelLg2"
              onChange={handleChange}
              value={codelist.labelLg2 || ""}
              aria-invalid={!!clientSideErrors.fields?.labelLg2}
              aria-describedby={clientSideErrors.fields?.labelLg2 ? "labelLg2-error" : null}
            />
            <ClientSideError
              id="labelLg2-error"
              error={clientSideErrors?.fields?.labelLg2}
            ></ClientSideError>
          </div>
        </Row>
        <div className="form-group">
          <CreatorsInput
            value={codelist.creator}
            onChange={(value) => {
              setCodelist({ ...codelist, creator: value });
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
            value={codelist.contributor}
            onChange={(values) => {
              setCodelist({ ...codelist, contributor: values });
            }}
          />
        </div>
        <div className="form-group">
          <DisseminationStatusInput
            value={codelist.disseminationStatus}
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
            <label htmlFor="descriptionLg1">{t("codelists.description", { lng: "fr" })}</label>
            <textarea
              value={codelist.descriptionLg1}
              className="form-control"
              id="descriptionLg1"
              name="descriptionLg1"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 form-group">
            <label htmlFor="descriptionLg2">{t("codelists.description", { lng: "en" })}</label>
            <textarea
              value={codelist.descriptionLg2}
              className="form-control"
              id="descriptionLg2"
              name="descriptionLg2"
              onChange={handleChange}
            />
          </div>
        </Row>
      </form>
      {updateMode && <CodesPanel codelist={codelist} editable={true} />}
    </>
  );
};
