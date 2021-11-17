import { syncNodes } from './codes-tree-edit';

describe('syncNodes', () => {
	it('should set expanded to true to the first child', () => {
		const previous = [
			{
				code: 1,
				expanded: true,
				children: [
					{
						label: 'label11',
						code: 2,
					},
				],
			},
		];

		const next = [
			{
				code: 1,
				children: [
					{
						code: 2,
						label: 'label1',
					},
				],
			},
		];

		expect(syncNodes(previous, next)).toEqual([
			{
				code: 1,
				expanded: true,
				children: [
					{
						children: [],
						label: 'label1',
						expanded: false,
						code: 2,
					},
				],
			},
		]);
	});

	it('real example', () => {
		const nextNodes = [
			{
				code: 'S.11',
				title: 'S.11 - Sociétés non financières',
				label: 'Sociétés non financières',
				parent: null,
				position: 1,
				children: [
					{
						code: 'S.11003',
						title: 'S.11003 - Sociétés non financières sous contrôle étranger',
						label: 'Sociétés non financières sous contrôle étranger',
						parent: 'S.11',
						position: 1,
						children: [
							{
								code: 'IABL.11003',
								title:
									'IABL.11003 - IABL non financières sous contrôle étranger',
								label: 'IABL non financières sous contrôle étranger',
								parent: 'S.11003',
								position: 1,
							},
							{
								code: 'ISLB.11003',
								title:
									'ISLB.11003 - ISLB non financières sous contrôle étranger',
								label: 'ISLB non financières sous contrôle étranger',
								parent: 'S.11003',
								position: 2,
							},
						],
					},
					{
						code: 'ISLB.11',
						title: 'ISLB.11 - Institutions sans but lucratif non financières',
						label: 'Institutions sans but lucratif non financières',
						parent: 'S.11',
						position: 2,
						children: [
							{
								code: 'ISLB.11002',
								title: 'ISLB.11002 - ISLB non financières privées nationales',
								label: 'ISLB non financières privées nationales',
								parent: 'ISLB.11',
								position: 1,
							},
							{
								code: 'ISLB.11003',
								title:
									'ISLB.11003 - ISLB non financières sous contrôle étranger',
								label: 'ISLB non financières sous contrôle étranger',
								parent: 'ISLB.11',
								position: 2,
							},
							{
								code: 'ISLB.11001',
								title: 'ISLB.11001 - ISLB non financières publiques',
								label: 'ISLB non financières publiques',
								parent: 'ISLB.11',
								position: 3,
							},
						],
					},
					{
						code: 'S.11002',
						title: 'S.11002 - Sociétés non financières privées nationales',
						label: 'Sociétés non financières privées nationales',
						parent: 'S.11',
						position: 3,
						children: [
							{
								code: 'IABL.11002',
								title: 'IABL.11002 - IABL non financières privées nationales',
								label: 'IABL non financières privées nationales',
								parent: 'S.11002',
								position: 1,
							},
							{
								code: 'ISLB.11002',
								title: 'ISLB.11002 - ISLB non financières privées nationales',
								label: 'ISLB non financières privées nationales',
								parent: 'S.11002',
								position: 2,
							},
						],
					},
					{
						code: 'IABL.11',
						title: 'IABL.11 - Institutions à but lucratif non financières',
						label: 'Institutions à but lucratif non financières',
						parent: 'S.11',
						position: 4,
						children: [
							{
								code: 'IABL.11001',
								title: 'IABL.11001 - IABL non financières publiques',
								label: 'IABL non financières publiques',
								parent: 'IABL.11',
								position: 1,
							},
							{
								code: 'IABL.11003',
								title:
									'IABL.11003 - IABL non financières sous contrôle étranger',
								label: 'IABL non financières sous contrôle étranger',
								parent: 'IABL.11',
								position: 2,
							},
							{
								code: 'IABL.11002',
								title: 'IABL.11002 - IABL non financières privées nationales',
								label: 'IABL non financières privées nationales',
								parent: 'IABL.11',
								position: 3,
							},
						],
					},
					{
						code: 'S.11001',
						title: 'S.11001 - Sociétés non financières publiques',
						label: 'Sociétés non financières publiques',
						parent: 'S.11',
						position: 5,
						children: [
							{
								code: 'IABL.11001',
								title: 'IABL.11001 - IABL non financières publiques',
								label: 'IABL non financières publiques',
								parent: 'S.11001',
								position: 1,
							},
							{
								code: 'ISLB.11001',
								title: 'ISLB.11001 - ISLB non financières publiques',
								label: 'ISLB non financières publiques',
								parent: 'S.11001',
								position: 2,
							},
						],
					},
				],
			},
		];
		const previousNodes = [
			{
				code: 'S.11',
				title: 'S.11 - Sociétés non financières',
				label: 'Sociétés non financières',
				parent: null,
				position: 1,
				children: [
					{
						code: 'S.11003',
						title: 'S.11003 - Sociétés non financières sous contrôle étranger',
						label: 'Sociétés non financières sous contrôle étranger',
						parent: 'S.11',
						position: 1,
						children: [
							{
								code: 'IABL.11003',
								title:
									'IABL.11003 - IABL non financières sous contrôle étranger',
								label: 'IABL non financières sous contrôle étranger',
								parent: 'S.11003',
								position: 1,
								expanded: false,
								children: [],
							},
							{
								code: 'ISLB.11003',
								title:
									'ISLB.11003 - ISLB non financières sous contrôle étranger',
								label: 'ISLB non financières sous contrôle étranger',
								parent: 'S.11003',
								position: 2,
								expanded: false,
								children: [],
							},
						],
						expanded: true,
					},
					{
						code: 'ISLB.11',
						title: 'ISLB.11 - Institutions sans but lucratif non financières',
						label: 'Institutions sans but lucratif non financières',
						parent: 'S.11',
						position: 2,
						children: [
							{
								code: 'ISLB.11002',
								title: 'ISLB.11002 - ISLB non financières privées nationales',
								label: 'ISLB non financières privées nationales',
								parent: 'ISLB.11',
								position: 1,
								expanded: false,
								children: [],
							},
							{
								code: 'ISLB.11003',
								title:
									'ISLB.11003 - ISLB non financières sous contrôle étranger',
								label: 'ISLB non financières sous contrôle étranger',
								parent: 'ISLB.11',
								position: 2,
								expanded: false,
								children: [],
							},
							{
								code: 'ISLB.11001',
								title: 'ISLB.11001 - ISLB non financières publiques',
								label: 'ISLB non financières publiques',
								parent: 'ISLB.11',
								position: 3,
								expanded: false,
								children: [],
							},
						],
						expanded: false,
					},
					{
						code: 'S.11002',
						title: 'S.11002 - Sociétés non financières privées nationales',
						label: 'Sociétés non financières privées nationales',
						parent: 'S.11',
						position: 3,
						children: [
							{
								code: 'IABL.11002',
								title: 'IABL.11002 - IABL non financières privées nationales',
								label: 'IABL non financières privées nationales',
								parent: 'S.11002',
								position: 1,
								expanded: false,
								children: [],
							},
							{
								code: 'ISLB.11002',
								title: 'ISLB.11002 - ISLB non financières privées nationales',
								label: 'ISLB non financières privées nationales',
								parent: 'S.11002',
								position: 2,
								expanded: false,
								children: [],
							},
						],
						expanded: false,
					},
					{
						code: 'IABL.11',
						title: 'IABL.11 - Institutions à but lucratif non financières',
						label: 'Institutions à but lucratif non financières',
						parent: 'S.11',
						position: 4,
						children: [
							{
								code: 'IABL.11001',
								title: 'IABL.11001 - IABL non financières publiques',
								label: 'IABL non financières publiques',
								parent: 'IABL.11',
								position: 1,
								expanded: false,
								children: [],
							},
							{
								code: 'IABL.11003',
								title:
									'IABL.11003 - IABL non financières sous contrôle étranger',
								label: 'IABL non financières sous contrôle étranger',
								parent: 'IABL.11',
								position: 2,
								expanded: false,
								children: [],
							},
							{
								code: 'IABL.11002',
								title: 'IABL.11002 - IABL non financières privées nationales',
								label: 'IABL non financières privées nationales',
								parent: 'IABL.11',
								position: 3,
								expanded: false,
								children: [],
							},
						],
						expanded: false,
					},
					{
						code: 'S.11001',
						title: 'S.11001 - Sociétés non financières publiques',
						label: 'Sociétés non financières publiques',
						parent: 'S.11',
						position: 5,
						children: [
							{
								code: 'IABL.11001',
								title: 'IABL.11001 - IABL non financières publiques',
								label: 'IABL non financières publiques',
								parent: 'S.11001',
								position: 1,
								expanded: false,
								children: [],
							},
							{
								code: 'ISLB.11001',
								title: 'ISLB.11001 - ISLB non financières publiques',
								label: 'ISLB non financières publiques',
								parent: 'S.11001',
								position: 2,
								expanded: false,
								children: [],
							},
						],
						expanded: false,
					},
				],
				expanded: true,
			},
		];
		expect(syncNodes(previousNodes, nextNodes)).toEqual(previousNodes);
	});
	it('should set expanded to true to the second child child', () => {
		const previous = [
			{
				code: 1,
				expanded: true,
				children: [
					{
						label: 'label11',
						expanded: true,
						code: 2,
						children: [
							{
								label: 'label3',
								code: 3,
							},
						],
					},
				],
			},
		];

		const next = [
			{
				code: 1,
				children: [
					{
						code: 2,
						label: 'label1',
						children: [
							{
								label: 'label3',
								code: 3,
							},
						],
					},
				],
			},
		];

		expect(syncNodes(previous, next)).toEqual([
			{
				code: 1,
				expanded: true,
				children: [
					{
						children: [
							{
								children: [],
								label: 'label3',
								code: 3,
								expanded: false,
							},
						],
						label: 'label1',
						expanded: true,
						code: 2,
					},
				],
			},
		]);
	});
});
