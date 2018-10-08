export function getTree(input, idParent, objectToMerge) {
	return input
		.filter(msd => msd.idParent === idParent)
		.sort((msd1, msd2) => {
			const msdId1 = parseInt(msd1.idMas.substr(2).replace('.', ''), 10);
			const msdId2 = parseInt(msd2.idMas.substr(2).replace('.', ''), 10);

			return msdId1 - msdId2;
		})
		.reduce((acc, msd) => {
			const msdToMerge = objectToMerge[msd.idMas] || {};
			return {
				...acc,
				[msd.idMas]: {
					...msd,
					isPresentational: msdToMerge.isPresentational || false,
					rangeType: msdToMerge.rangeType,
					codeList: msdToMerge.codeList,
					children: getTree(input, msd.idMas, objectToMerge),
				},
			};
		}, {});
}

export const rangeType = {
	REPORTED_ATTRIBUTE: 'REPORTED_ATTRIBUTE',
	TEXT: 'TEXT',
	DATE: 'DATE',
	CODE_LIST: 'CODE_LIST',
};
