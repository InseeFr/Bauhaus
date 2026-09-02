import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

import { ContributorsInput } from "@components/business/contributors-input/contributors-input";
import { CreatorsInput } from "@components/business/creators-input";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { ClientSideError, ErrorBloc, GlobalClientSideErrorBloc } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { LabelRequired } from "@components/label-required";
import { Row } from "@components/layout";
import { Saving } from "@components/loading";

import { StructureApi } from "@sdk/index";

import { initializeContributorProperty } from "@utils/creation/contributor-init";
import { useDefaultContributor } from "@utils/creation/use-default-contributor";

import { useAppContext } from "../../../../../application/app-context";
import { useAuthorizationGuard } from "../../../../../auth/components/auth";
import { DISSEMINATION_STATUS } from "../../../../constants";
import { validate } from "../validation";
import { Controls } from "./Controls";
import { StructureComponents } from "./StructureComponents";

const defaultDSD = {
  identifiant: "",
  labelLg1: "",
  labelLg2: "",
  descriptionLg1: "",
  descriptionLg2: "",
  disseminationStatus: DISSEMINATION_STATUS.PUBLIC_GENERIC,
  contributor: [],
  componentDefinitions: [],
  isRequiredBy: "",
};

export const EditionForm = ({ creation, initialStructure }) => {
  const { t } = useTranslation();

  const { lg1, lg2 } = useAppContext();

  const [structure, setStructure] = useState(defaultDSD);

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [redirectId, setRedirectId] = useState("");

  const [serverSideError, setServerSideError] = useState("");

  const [clientSideError, setClientSideError] = useState({});

  const onChange = (key) => (value) => {
    setStructure({ ...structure, [key]: value });
    setClientSideError({
      ...clientSideError,
      errorMessage: [],
    });
  };

  const {
    identifiant,
    labelLg1,
    labelLg2,
    descriptionLg1,
    descriptionLg2,
    componentDefinitions = [],
    creator,
    contributor,
    disseminationStatus,
  } = structure;

  const isContributor = useAuthorizationGuard("STRUCTURE_STRUCTURE", "CREATE");

  const defaultContributor = useDefaultContributor(isContributor);

  useEffect(() => {
    let structure = {
      ...defaultDSD,
      ...initialStructure,
      ...initializeContributorProperty(isContributor, creation, defaultContributor),
    };

    setStructure(structure);
  }, [initialStructure, isContributor, defaultContributor, creation]);

  if (redirectId) return <Navigate to={`/structures/${redirectId}`} replace />;

  if (loading) return <Saving />;

  const onSave = () => {
    const clientSideErrors = validate(structure);

    if (clientSideErrors.errorMessage?.length > 0) {
      setSubmitting(true);
      setClientSideError(clientSideErrors);
    } else {
      setLoading(true);
      (creation ? StructureApi.postStructure(structure) : StructureApi.putStructure(structure))
        .then((id) => {
          setRedirectId(id);
        })
        .catch((error) => {
          setServerSideError(error);
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <Controls
        creation={creation}
        save={onSave}
        disabledSave={clientSideError.errorMessage?.length > 0}
      />
      {submitting && clientSideError && (
        <GlobalClientSideErrorBloc clientSideErrors={clientSideError.errorMessage} />
      )}
      <ErrorBloc error={serverSideError} />
      <LabelRequired htmlFor="identifiant">{t("structure.notation")}</LabelRequired>
      <TextInput
        id="identifiant"
        value={identifiant}
        onChange={(e) => onChange("identifiant")(e.target.value)}
        disabled={!creation}
        aria-invalid={!!clientSideError.fields?.identifiant}
        aria-describedby={clientSideError.fields?.identifiant ? "identifiant-error" : null}
      />
      <ClientSideError
        id="identifiant-error"
        error={clientSideError?.fields?.identifiant}
      ></ClientSideError>
      <Row>
        <div className="col-md-6">
          <LabelRequired htmlFor="labelLg1">{t("structure.label", { lng: "fr" })}</LabelRequired>
          <TextInput
            id="labelLg1"
            value={labelLg1}
            onChange={(e) => onChange("labelLg1")(e.target.value)}
            aria-invalid={!!clientSideError.fields?.labelLg1}
            aria-describedby={clientSideError.fields?.labelLg1 ? "labelLg1-error" : null}
          />
          <ClientSideError
            id="labelLg1-error"
            error={clientSideError?.fields?.labelLg1}
          ></ClientSideError>
        </div>
        <div className="col-md-6">
          <LabelRequired htmlFor="labelLg1">{t("structure.label", { lng: "en" })}</LabelRequired>
          <TextInput
            id="labelLg2"
            value={labelLg2}
            onChange={(e) => onChange("labelLg2")(e.target.value)}
            aria-invalid={!!clientSideError.fields?.labelLg2}
            aria-describedby={clientSideError.fields?.labelLg2 ? "labelLg2-error" : null}
          />
          <ClientSideError
            id="labelLg2-error"
            error={clientSideError?.fields?.labelLg2}
          ></ClientSideError>
        </div>
      </Row>
      <Row>
        <div className="col-md-6">
          <label htmlFor="descriptionLg1">
            {t("structure.description", { lng: "fr" })} ({lg1})
          </label>
          <TextInput
            id="descriptionLg1"
            value={descriptionLg1}
            onChange={(e) => onChange("descriptionLg1")(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="descriptionLg2">
            {t("structure.description", { lng: "en" })} ({lg2})
          </label>
          <TextInput
            id="descriptionLg2"
            value={descriptionLg2}
            onChange={(e) => onChange("descriptionLg2")(e.target.value)}
          />
        </div>
      </Row>
      <div className="form-group">
        <CreatorsInput mode="organisation" value={creator} onChange={onChange("creator")} />
      </div>
      <div className="form-group">
        <ContributorsInput
          mode="organisation"
          value={contributor}
          onChange={onChange("contributor")}
          multi
        />
      </div>
      <div className="form-group">
        <DisseminationStatusInput
          value={disseminationStatus}
          handleChange={onChange("disseminationStatus")}
        />
      </div>
      <StructureComponents
        creation={creation}
        componentDefinitions={componentDefinitions}
        onChange={onChange("componentDefinitions")}
        structure={structure}
      />
    </>
  );
};
