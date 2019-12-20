export default () =>
	Promise.resolve([
		{
			sourceId: 'A',
			targetLabelLg1:
				"Produits de l'agriculture, de la sylviculture et de la pêche",
			targetId: 'A',
			targetLabelLg2: 'Products of agriculture, forestry and fishing',
			id: 'A-A',
			sourceLabelLg2: 'Agriculture, forestry and fishing',
			sourceLabelLg1: 'Agriculture, sylviculture et pêche',
		},
		{
			sourceId: 'B',
			targetLabelLg1: 'Produits des industries extractives',
			targetId: 'B',
			targetLabelLg2: 'Mining and quarrying',
			id: 'B-B',
			sourceLabelLg2: 'Mining and quarrying',
			sourceLabelLg1: 'Industries extractives',
		},
		{
			sourceId: 'C',
			targetLabelLg1: 'Produits manufacturés',
			targetId: 'C',
			targetLabelLg2: 'Manufactured products',
			id: 'C-C',
			sourceLabelLg2: 'Manufacturing',
			sourceLabelLg1: 'Industrie manufacturière',
		},
	]);
