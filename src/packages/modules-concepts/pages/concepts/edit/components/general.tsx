import { useTranslation } from "react-i18next";

import { ContributorsInput } from "@components/business/contributors-input/contributors-input";
import { CreatorsInput } from "@components/business/creators-input";
import { DatePicker } from "@components/date-picker";
import { DisseminationStatusInput } from "@components/dissemination-status/disseminationStatus";
import { ClientSideError } from "@components/errors-bloc";
import { TextInput } from "@components/form/input";
import { InputRmes } from "@components/input-rmes";
import { Row } from "@components/layout";
import { RequiredIcon } from "@components/required-icon";
import { Select } from "@components/ui/select";
import { InputMulti } from "@components/ui/forms/input-multi";

import { useLocales } from "@utils/hooks/useLocales";

import { ConceptGeneral } from "../../../../../model/concepts/concept";
import { useCollections } from "../../../../hooks/useCollections";
import { fields as generalFields } from "../../../../utils/general";

type GeneralFieldName = keyof ConceptGeneral;

type GeneralValue = string | string[] | boolean;

type FieldHandlers = Partial<Record<GeneralFieldName, (value: GeneralValue) => void>>;

const handleFieldChange = (
  handleChange: (update: Partial<ConceptGeneral>) => void,
): FieldHandlers =>
  generalFields.reduce<FieldHandlers>((handlers, fieldName) => {
    const key = fieldName as GeneralFieldName;
    handlers[key] = (value: GeneralValue) =>
      handleChange({ [key]: value } as Partial<ConceptGeneral>);
    return handlers;
  }, {});

interface ConceptGeneralEditionProps {
  general: ConceptGeneral;
  handleChange: (update: Partial<ConceptGeneral>) => void;
  errorMessage?: { fields: Record<string, string>; errorMessage: string[] };
  stampList?: { value: string; label: string }[];
}

function ConceptGeneralEdition({
  general,
  handleChange,
  errorMessage,
}: Readonly<ConceptGeneralEditionProps>) {
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
    collections,
  } = general;

  const { t } = useTranslation();
  const { lg1, lg2 } = useLocales();
  const { data = [] } = useCollections();

  const handlers = handleFieldChange(handleChange);

  return (
    <div>
      <h4 className="text-center">
        ( <RequiredIcon /> : {t("concept.edit.requiredFields")})
      </h4>
      <div className="form-group">
        <Select
          label={t("concept.edit.collectionLabel")}
          placeholder=""
          options={data.map((c) => ({
            value: c.id,
            label: c.label.value,
          }))}
          value={collections}
          multi
          onChange={(value) => handlers.collections?.(value)}
        />
      </div>
      <Row>
        <InputRmes
          colMd={6}
          label={`${t("concept.edit.labelTitle")} (${lg1})`}
          star
          value={prefLabelLg1}
          handleChange={(value: string) => handlers.prefLabelLg1?.(value)}
          className="w-100"
          errorBlock={
            <ClientSideError id="prefLabelLg1-error" error={errorMessage?.fields?.prefLabelLg1} />
          }
        />
        <InputRmes
          colMd={6}
          label={`${t("concept.edit.labelTitle")} (${lg2})`}
          hiddenStar
          value={prefLabelLg2}
          handleChange={(value: string) => handlers.prefLabelLg2?.(value)}
          className="w-100"
        />
      </Row>
      <InputMulti
        inputLg1={Array.isArray(altLabelLg1) ? altLabelLg1 : altLabelLg1 ? [altLabelLg1] : []}
        inputLg2={Array.isArray(altLabelLg2) ? altLabelLg2 : altLabelLg2 ? [altLabelLg2] : []}
        labelLg1={`${t("concept.general.altLabelTitle")} (${lg1})`}
        labelLg2={`${t("concept.general.altLabelTitle")} (${lg2})`}
        handleChangeLg1={(value: string[]) => handlers.altLabelLg1?.(value)}
        handleChangeLg2={(value: string[]) => handlers.altLabelLg2?.(value)}
      />
      <div className="form-group">
        <CreatorsInput
          value={creator}
          onChange={(value: string | string[]) => handlers.creator?.(value)}
          mode="organisation"
        />
        <ClientSideError id="creator-error" error={errorMessage?.fields?.creator} />
      </div>
      <div className="form-group">
        <ContributorsInput disabled value={contributor} onChange={() => {}} mode="organisation" />
      </div>
      <div className="form-group">
        <DisseminationStatusInput
          value={disseminationStatus}
          handleChange={(value) => handlers.disseminationStatus?.(value ?? "")}
          required
        />
        <ClientSideError
          id="disseminationStatus-error"
          error={errorMessage?.fields?.disseminationStatus}
        />
      </div>
      <div className="form-group">
        <label>{t("concept.general.additionalMaterialTitle")}</label>
        <div className="input-group">
          <span className="input-group-addon">http://</span>
          <TextInput
            value={additionalMaterial?.replace("http://", "") ?? ""}
            onChange={(e) => handlers.additionalMaterial?.(e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label>{t("concept.general.validDateTitle")}</label>
        <DatePicker
          value={typeof valid === "string" ? valid : ""}
          onChange={(value: string) => handlers.valid?.(value)}
        />
      </div>
    </div>
  );
}

export default ConceptGeneralEdition;
