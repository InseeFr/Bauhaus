import {
	BROADER,
	NARROWER,
	REFERENCES,
	SUCCEED,
	RELATED,
	NONE,
	CLOSE_MATCH,
	IS_REPLACED_BY,
} from '../../constants';

const linkTypes = {
	[BROADER]: BROADER,
	[NARROWER]: NARROWER,
	[REFERENCES]: REFERENCES,
	[SUCCEED]: SUCCEED,
	[RELATED]: RELATED,
	[CLOSE_MATCH]: CLOSE_MATCH,
	[IS_REPLACED_BY]: IS_REPLACED_BY,
};

const getType = (typeOfLink) => {
	const type = linkTypes[typeOfLink];
	if (type) return type;
	throw new TypeError(
		`The type of a link was not recognized: \`${typeOfLink}\``
	);
};

export const mergeWithAllConcepts = (concepts, links) =>
	concepts.map(({ id, label }) => {
		const link = links.find(({ id: idLinked }) => idLinked === id);
		const typeOfLink = link ? getType(link.typeOfLink) : NONE;
		return {
			id,
			label,
			typeOfLink,
			prefLabelLg1: link && link.prefLabelLg1,
			prefLabelLg2: link && link.prefLabelLg2,
		};
	});
