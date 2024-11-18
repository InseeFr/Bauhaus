import { Component } from '../../model/structures/Component';
import { MUTUALIZED_COMPONENT_TYPES, ATTACHMENTS } from './constants/';

export const getAllAttachment = (
	measures: Component[] = [],
	specification: any,
) => {
	// We find one measure linked to the attribute
	const measureWithThisAttribute = measures.find((measure: any) => {
		return !!Object.keys(measure)
			.filter((key) => key.indexOf('attribute_') === 0)
			.find((key) => {
				return measure[key] === specification.component.iri;
			});
	});

	const measuresOptions = measures.map((c: Component) => ({
		value: c.id,
		label: c.labelLg1,
	}));

	// If this measure exists, this attribute can only have a measure as an attachment
	if (measureWithThisAttribute) {
		return measuresOptions;
	}

	return [...ATTACHMENTS, ...measuresOptions];
};
export const formatLabel = (component: Component) => {
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
