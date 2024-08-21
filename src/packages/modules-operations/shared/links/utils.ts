import { SeeAlso } from '../../../model/Operation';

/**
 *
 * @param {Array<SeeAlso>} seeAlso an array of SeeAlso object
 * @returns an object corresponding to the array grouped by type of seeAlso
 */
export function getSeeAlsoByType(seeAlso: SeeAlso[] = []) {
	return seeAlso.reduce((acc: Record<string, SeeAlso[]>, link: SeeAlso) => {
		return {
			...acc,
			[link.type]: [...(acc[link.type] || []), link],
		};
	}, {});
}
