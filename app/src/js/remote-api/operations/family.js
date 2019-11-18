export default {
	getFamiliesList: () => ['families'],
	getFamily: id => [`family/${id}`],
	getFamiliesSearchList: () => ['families/advanced-search'],
	publishFamily: family => [
		`family/validate/${family.id}`,
		{ method: 'PUT' },
		res => res.text(),
	],
	putFamily: family => [
		`family/${family.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(family),
		},
		() => Promise.resolve(family.id),
	],
	postFamily: family => [
		`family`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(family),
		},
		res => res.text(),
	],
};
