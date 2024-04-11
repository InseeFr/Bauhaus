export const convertCodesListsToSelectOption = (codesList) =>
	codesList?.codes?.map((code) => ({
		value: code.iri,
		label: code.labelLg1,
	})) ?? [];
