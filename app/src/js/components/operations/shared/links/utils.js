/**
 *
 * @param {Array<SeeAlso>} seeAlso an array of SeeAlso object
 * @returns an object corresponding to the array grouped by type of seeAlso
 */
export function getSeeAlsoByType(seeAlso = []) {
	return seeAlso.reduce((acc, link) => {
		return {
			...acc,
			[link.type]: [...(acc[link.type] || []), link],
		};
	}, {});
}
