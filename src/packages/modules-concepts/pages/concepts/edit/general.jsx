import { CreatorsInput } from "@components/business/creators-input";
import { DatePicker } from "@components/date-picker";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { ClientSideError } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { InputMulti } from "@components/ui/forms/input-multi";
import { InputRmes } from "@components/input-rmes";
import { Row } from "@components/layout";
import { RequiredIcon } from "@components/required-icon";

import { useTranslation } from "react-i18next";
import { useLocales } from "@utils/hooks/useLocales";
import { fields as generalFields } from "../../../utils/general";
import { ContributorsInput } from "@components/business/contributors-input/contributors-input";

const handleFieldChange = (handleChange) =>
  generalFields.reduce((handlers, fieldName) => {
    handlers[fieldName] = (value) => handleChange({ [fieldName]: value });
    return handlers;
  }, {});

function ConceptGeneralEdition({ general, handleChange, errorMessage }) {
  const {
    prefLabelLg1,
    prefLabelLg2,
    altLabelLg1,
    altLabelLg2,
    disseminationStatus,
    creator,
    contributor,
    additionalMaterial,
    valid,
  } = general;

  const { t } = useTranslation();
  const { lg1, lg2 } = useLocales();

  const handlers = handleFieldChange(handleChange);

  return (
    <div>
      <h4 className="text-center">
        ( <RequiredIcon /> : {t("concept.edit.requiredFields")})
      </h4>
      <Row>
        <InputRmes
          colMd={6}
          label={`${t("concept.edit.labelTitle")} (${lg1})`}
          star
          value={prefLabelLg1}
          handleChange={handlers.prefLabelLg1}
          className="w-100"
          errorBlock={
            <ClientSideError
              id="prefLabelLg1-error"
              error={errorMessage?.fields?.prefLabelLg1}
            ></ClientSideError>
          }
        />
        <InputRmes
          colMd={6}
          label={`${t("concept.edit.labelTitle")} (${lg2})`}
          hiddenStar
          value={prefLabelLg2}
          handleChange={handlers.prefLabelLg2}
          className="w-100"
        />
      </Row>
      <InputMulti
        inputLg1={altLabelLg1}
        inputLg2={altLabelLg2}
        labelLg1={`${t("concept.general.altLabelTitle")} (${lg1})`}
        labelLg2={`${t("concept.general.altLabelTitle")} (${lg2})`}
        handleChangeLg1={handlers.altLabelLg1}
        handleChangeLg2={handlers.altLabelLg2}
      />
      <div className="form-group">
        <CreatorsInput value={creator} onChange={handlers.creator} mode="organisation" />
        <ClientSideError id="creator-error" error={errorMessage?.fields?.creator}></ClientSideError>
      </div>
      <div className="form-group">
        <ContributorsInput disabled value={contributor} mode="organisation" />
      </div>
      <div className="form-group">
        <DisseminationStatusInput
          value={disseminationStatus}
          handleChange={handlers.disseminationStatus}
          required
        ></DisseminationStatusInput>
        <ClientSideError
          id="disseminationStatus-error"
          error={errorMessage?.fields?.disseminationStatus}
        ></ClientSideError>
      </div>
      <div className="form-group">
        <label>{t("concept.general.additionalMaterialTitle")}</label>
        <div className="input-group">
          <span className="input-group-addon">http://</span>
          <TextInput
            value={additionalMaterial?.replace("http://", "")}
            onChange={(e) => handlers.additionalMaterial(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label>{t("concept.general.validDateTitle")}</label>
        <DatePicker value={valid} onChange={handlers.valid} placement="top" />
      </div>
    </div>
  );
}

export default ConceptGeneralEdition;
