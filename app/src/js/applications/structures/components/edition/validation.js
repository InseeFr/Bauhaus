import D, { D1, D2 } from 'js/i18n';

export const validate = (component) => {
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
