import { useTranslation } from "react-i18next";

import { ContributorsInput } from "@components/business/contributors-input/contributors-input";
import { CreatorsInput } from "@components/business/creators-input";
import { ClientSideError } from "@components/errors-bloc";
import { InputRmes } from "@components/input-rmes";
import { Row } from "@components/layout";
import { RequiredIcon } from "@components/required-icon";

import { fieldsWithRequired } from "../../../../utils/collection-general";

interface CollectionGeneral {
  id?: string;
  prefLabelLg1?: string;
  prefLabelLg2?: string;
  creator?: string;
  contributor?: string;
  descriptionLg1?: string;
  descriptionLg2?: string;
}

type GeneralFieldName = keyof CollectionGeneral;
type GeneralValue = string | string[];
type FieldHandlers = Partial<Record<GeneralFieldName, (value: GeneralValue) => void>>;

const generalFields = fieldsWithRequired.map(([name]) => name as GeneralFieldName);

const handleFieldChange = (
  handleChange: (update: Partial<CollectionGeneral>) => void,
): FieldHandlers =>
  generalFields.reduce<FieldHandlers>((handlers, fieldName) => {
    handlers[fieldName] = (value: GeneralValue) =>
      handleChange({ [fieldName]: value } as Partial<CollectionGeneral>);
    return handlers;
  }, {});

interface CollectionGeneralEditionProps {
  general: CollectionGeneral;
  handleChange: (update: Partial<CollectionGeneral>) => void;
  errors?: { fields: Record<string, string>; errorMessage: string[] };
  creation?: boolean;
}

function CollectionGeneralEdition({
  general,
  handleChange,
  errors,
  creation,
}: Readonly<CollectionGeneralEditionProps>) {
  const { t, i18n } = useTranslation();
  const t1 = i18n.getFixedT("fr");
  const t2 = i18n.getFixedT("en");
  const { id, prefLabelLg1, prefLabelLg2, creator, contributor, descriptionLg1, descriptionLg2 } =
    general;

  const handlers = handleFieldChange(handleChange);

  return (
    <div>
      <h4 className="text-center">
        ( <RequiredIcon /> : {t("common.requiredFields")})
      </h4>

      {creation && (
        <Row>
          <InputRmes
            colMd={12}
            label={t("common.identifiantTitle")}
            star
            value={id ?? ""}
            handleChange={(value: string) => handlers.id?.(value)}
            className="w-100"
            errorBlock={<ClientSideError id="id-error" error={errors?.fields?.id} />}
          />
        </Row>
      )}

      <Row>
        <InputRmes
          colMd={6}
          label={t1("common.labelTitle")}
          star
          value={prefLabelLg1 ?? ""}
          handleChange={(value: string) => handlers.prefLabelLg1?.(value)}
          className="w-100"
          errorBlock={<ClientSideError id="labelLg1-error" error={errors?.fields?.prefLabelLg1} />}
        />
        <InputRmes
          colMd={6}
          label={t2("common.labelTitle")}
          hiddenStar
          value={prefLabelLg2 ?? ""}
          handleChange={(value: string) => handlers.prefLabelLg2?.(value)}
          className="w-100"
        />
      </Row>

      <div className="form-group">
        <CreatorsInput
          mode="organisation"
          value={creator ?? ""}
          onChange={(value: string | string[]) => handlers.creator?.(value)}
        />
        <ClientSideError id="creator-error" error={errors?.fields?.creator} />
      </div>
      <div className="form-group">
        <ContributorsInput
          mode="organisation"
          value={contributor ?? ""}
          onChange={() => {}}
          disabled
        />
      </div>
      <Row>
        <InputRmes
          colMd={6}
          label={t1("common.descriptionTitle")}
          value={descriptionLg1 ?? ""}
          handleChange={(value: string) => handlers.descriptionLg1?.(value)}
          className="w-100"
        />
        <InputRmes
          colMd={6}
          label={t2("common.descriptionTitle")}
          value={descriptionLg2 ?? ""}
          handleChange={(value: string) => handlers.descriptionLg2?.(value)}
          className="w-100"
        />
      </Row>
    </div>
  );
}

export default CollectionGeneralEdition;
