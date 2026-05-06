import { CreatorsInput } from "@components/business/creators-input";
import { ClientSideError } from "@components/errors-bloc";
import { InputRmes } from "@components/input-rmes";
import { Row } from "@components/layout";
import { RequiredIcon } from "@components/required-icon";

import D, { D1, D2 } from "../../../../../deprecated-locales";
import { fieldsWithRequired } from "../../../../collections/utils/general";

const generalFields = fieldsWithRequired.map(([name]) => name);
import { ContributorsInput } from "@components/business/contributors-input/contributors-input";

const handleFieldChange = (handleChange) =>
  generalFields.reduce((handlers, fieldName) => {
    handlers[fieldName] = (value) => handleChange({ [fieldName]: value });
    return handlers;
  }, {});

function CollectionGeneralEdition({ general, handleChange, errors, creation }) {
  const { id, prefLabelLg1, prefLabelLg2, creator, contributor, descriptionLg1, descriptionLg2 } =
    general;

  const handlers = handleFieldChange(handleChange);

  return (
    <div>
      <h4 className="text-center">
        ( <RequiredIcon /> : {D.requiredFields})
      </h4>

      {creation && (
        <Row>
          <InputRmes
            colMd={12}
            label={D.identifiantTitle}
            star
            value={id ?? ""}
            handleChange={handlers.id}
            className="w-100"
            errorBlock={
              <ClientSideError id="id-error" error={errors?.fields?.id}></ClientSideError>
            }
          />
        </Row>
      )}

      <Row>
        <InputRmes
          colMd={6}
          label={D1.labelTitle}
          star
          value={prefLabelLg1}
          handleChange={handlers.prefLabelLg1}
          className="w-100"
          errorBlock={
            <ClientSideError
              id="labelLg1-error"
              error={errors?.fields?.prefLabelLg1}
            ></ClientSideError>
          }
        />
        <InputRmes
          colMd={6}
          label={D2.labelTitle}
          hiddenStar
          value={prefLabelLg2}
          handleChange={handlers.prefLabelLg2}
          className="w-100"
        />
      </Row>

      <div className="form-group">
        <CreatorsInput mode="organisation" value={creator} onChange={handlers.creator} />
        <ClientSideError id="creator-error" error={errors?.fields?.creator}></ClientSideError>
      </div>
      <div className="form-group">
        <ContributorsInput mode="organisation" value={contributor} disabled />
      </div>
      <Row>
        <InputRmes
          colMd={6}
          label={D1.descriptionTitle}
          value={descriptionLg1}
          handleChange={handlers.descriptionLg1}
          className="w-100"
        />
        <InputRmes
          colMd={6}
          label={D2.descriptionTitle}
          value={descriptionLg2}
          handleChange={handlers.descriptionLg2}
          className="w-100"
        />
      </Row>
    </div>
  );
}

export default CollectionGeneralEdition;
