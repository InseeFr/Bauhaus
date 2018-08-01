export function getLinksByCategory(array = [], category) {
	return array.filter(link => link.typeOfLink === category).map(seeAlso => {
		const uriLinked = seeAlso.uriLinked;
		const baseLink = uriLinked.substr(0, uriLinked.lastIndexOf('/'));
		return {
			...seeAlso,
			type: baseLink.substr(baseLink.lastIndexOf('/') + 1, baseLink.length),
			id: uriLinked.substr(uriLinked.lastIndexOf('/') + 1, uriLinked.length),
		};
	});
}

export function getSeeAlsoByType(array = []) {
	return getLinksByCategory(array, 'seeAlso').reduce((acc, link) => {
		return {
			...acc,
			[link.type]: [...(acc[link.type] || []), link],
		};
	}, {});
}
