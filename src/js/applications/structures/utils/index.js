import D from '../i18n/build-dictionary';
import { MUTUALIZED_COMPONENT_TYPES, ATTACHMENTS } from './constants/';

export const getAllAttachment = (measures = [], specification) => {
	// We find one measure linked to the attribute
	const measureWithThisAttribute = measures.find((measure) => {
		return !!Object.keys(measure)
			.filter((key) => key.indexOf('attribute_') === 0)
			.find((key) => {
				return measure[key] === specification.component.iri;
			});
	});

	const measuresOptions = measures.map((c) => ({
		value: c.id,
		label: c.labelLg1,
	}));

	// If this measure exists, this attribute can only have a measure as an attachment
	if (!!measureWithThisAttribute) {
		return measuresOptions;
	}

	return [...ATTACHMENTS, ...measuresOptions];
};
export const formatLabel = (component) => {
	return (
		<>
			{component.labelLg1}
			<span className="badge badge-pill" style={{ marginLeft: '1em' }}>
				{
					MUTUALIZED_COMPONENT_TYPES.find((c) => c.value === component.type)
						?.label
				}
			</span>
		</>
	);
};
export const typeUriToLabel = (uri = '') => {
	return MUTUALIZED_COMPONENT_TYPES.find((component) => component.value === uri)
		?.label;
};

export const defaultComponentsTableParams = [
	{
		dataField: 'labelLg1',
		text: D.label,
		width: '20%',
		isKey: true,
	},
	{
		dataField: 'type',
		text: D.type,
		width: '20%',
	},
	{
		dataField: 'mutualized',
		text: D.mutualized,
		width: '10%',
	},
	{
		dataField: 'concept',
		text: D.conceptTitle,
		width: '20%',
	},
	{
		dataField: 'representation',
		text: D.representationTitle,
		width: '20%',
	},
	{
		dataField: 'actions',
		text: '',
		width: '20%',
	},
];
