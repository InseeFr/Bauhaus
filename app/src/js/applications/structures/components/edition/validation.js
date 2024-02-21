import D, { D1, D2 } from 'js/i18n';
import { formatValidation } from 'js/utils/validation';
import { z } from 'zod';

export const validate2 = (component) => {
    const errorMessage = [];
    const fields = {};

    if  (!component.identifiant)  {
        errorMessage.push(D.mandatoryProperty(D.idTitle));
        fields.identifiant = D.mandatoryProperty(D.idTitle);
    }
    if  (!component.labelLg1)  {
        errorMessage.push(D.mandatoryProperty(D1.labelTitle));
        fields.labelLg1 = D.mandatoryProperty(D1.labelTitle);
    }
    if  (!component.labelLg2)  {
        errorMessage.push(D.mandatoryProperty(D2.labelTitle));
        fields.labelLg2 = D.mandatoryProperty(D2.labelTitle);
    }
    if  (!component.type)  {
        errorMessage.push(D.mandatoryProperty(D1.type));
        fields.type = D.mandatoryProperty(D.type);
    }

    return {
        errorMessage,
        fields,
    };
};

const Component = z.object({
    identifiant: z.string({ required_error: D.mandatoryProperty(D.idTitle) }).min(1, { message: D.mandatoryProperty(D.idTitle) }),
    labelLg1: z.string({ required_error: D.mandatoryProperty(D1.labelTitle) }).min(1, { message: D.mandatoryProperty(D1.labelTitle) }),
    labelLg2: z.string({ required_error: D.mandatoryProperty(D2.labelTitle) }).min(1, { message: D.mandatoryProperty(D2.labelTitle) }),
    type: z.string({ required_error: D.mandatoryProperty(D.type) }).min(1, { message: D.mandatoryProperty(D.type) }),
});

export const validate = formatValidation(Component);
