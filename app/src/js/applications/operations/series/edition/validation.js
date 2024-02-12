import D, { D1, D2 } from 'js/i18n';

export const listOfExtraMandatoryFields = (
	process.env.REACT_APP_VALIDATION_OPERATION_SERIES_EXTRA_MANDATORY_FIELDS ?? ''
).split(',');

const fieldToTitleMapping = {
	creators: D1.creatorTitle,
	prefLabelLg1: D1.title,
	prefLabelLg2: D2.title,
	family: D1.familyTitle,
	typeCode: D1.operationType,
	accrualPeriodicityCode: D1.dataCollectFrequency,
};

export const isMandatoryField = (fieldName) =>
	listOfExtraMandatoryFields.indexOf(fieldName) >= 0;

export function validate({
	creators,
	prefLabelLg1,
	prefLabelLg2,
	family,
	...otherFields
}) {
	const fields = {};
	const errorMessage = [];

	if (!creators || creators.length === 0) {
		errorMessage.push(D.mandatoryProperty(fieldToTitleMapping.creators));
		fields.creators = D.mandatoryProperty(fieldToTitleMapping.creators);
	}

	if (!prefLabelLg1) {
		errorMessage.push(D.mandatoryProperty(fieldToTitleMapping.prefLabelLg1));
		fields.prefLabelLg1 = D.mandatoryProperty(fieldToTitleMapping.prefLabelLg1);
	}
	if (!prefLabelLg2) {
		errorMessage.push(D.mandatoryProperty(fieldToTitleMapping.prefLabelLg2));
		fields.prefLabelLg2 = D.mandatoryProperty(fieldToTitleMapping.prefLabelLg2);
	}

	if (!family) {
		errorMessage.push(D.mandatoryProperty(fieldToTitleMapping.family));
		fields.family = D.mandatoryProperty(fieldToTitleMapping.family);
	}

	listOfExtraMandatoryFields.forEach((extraMandatoryField) => {
		if (!otherFields[extraMandatoryField]) {
			errorMessage.push(
				D.mandatoryProperty(fieldToTitleMapping[extraMandatoryField] ?? '')
			);
			fields[extraMandatoryField] = D.mandatoryProperty(
				fieldToTitleMapping[extraMandatoryField] ?? ''
			);
		}
	});
	return {
		fields,
		errorMessage,
	};
}
