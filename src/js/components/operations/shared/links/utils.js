export function getSeeAlsoByType(seeAlso = []) {
	return seeAlso.reduce((acc, link) => {
		return {
			...acc,
			[link.type]: [...(acc[link.type] || []), link],
		};
	}, {});
}
