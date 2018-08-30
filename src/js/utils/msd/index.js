export function getTree(input, idParent) {
	return input.filter(msd => msd.idParent === idParent).reduce((acc, msd) => {
		return {
			...acc,
			[msd.idMas]: {
				...msd,
				children: getTree(input, msd.idMas),
			},
		};
	}, {});
}
