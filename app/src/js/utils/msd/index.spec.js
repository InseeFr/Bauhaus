import { getTree, flattenTree, getLabelsFromParent } from './index';

describe('flattenTree', () => {
	it('should return the right flat array', () => {
		const output = {
			'1': {
				children: {
					'4': { children: {}, idMas: '4', idParent: '1' },
					'5': { children: {}, idMas: '5', idParent: '1' },
					'6': { children: {}, idMas: '6', idParent: '1' },
				},
				idMas: '1',
			},
			'10': { children: {}, idMas: '10', idParent: '8' },
			'11': { children: {}, idMas: '11', idParent: '9' },
			'12': { children: {}, idMas: '12', idParent: '3' },
			'2': {
				children: {
					'7': { children: {}, idMas: '7', idParent: '2' },
					'8': {
						children: { '10': { children: {}, idMas: '10', idParent: '8' } },
						idMas: '8',
						idParent: '2',
					},
				},
				idMas: '2',
			},
			'3': {
				children: {
					'12': { children: {}, idMas: '12', idParent: '3' },
					'9': {
						children: { '11': { children: {}, idMas: '11', idParent: '9' } },
						idMas: '9',
						idParent: '3',
					},
				},
				idMas: '3',
			},
			'4': { children: {}, idMas: '4', idParent: '1' },
			'5': { children: {}, idMas: '5', idParent: '1' },
			'6': { children: {}, idMas: '6', idParent: '1' },
			'7': { children: {}, idMas: '7', idParent: '2' },
			'8': {
				children: { '10': { children: {}, idMas: '10', idParent: '8' } },
				idMas: '8',
				idParent: '2',
			},
			'9': {
				children: { '11': { children: {}, idMas: '11', idParent: '9' } },
				idMas: '9',
				idParent: '3',
			},
		};
		const input = {
			'1': {
				idMas: '1',
				children: {
					'4': {
						idMas: '4',
						idParent: '1',
						children: {},
					},
					'5': {
						idMas: '5',
						idParent: '1',
						children: {},
					},
					'6': {
						idMas: '6',
						idParent: '1',
						children: {},
					},
				},
			},
			'2': {
				idMas: '2',
				children: {
					'7': {
						idMas: '7',
						idParent: '2',
						children: {},
					},
					'8': {
						idMas: '8',
						idParent: '2',
						children: {
							'10': {
								idMas: '10',
								idParent: '8',
								children: {},
							},
						},
					},
				},
			},
			'3': {
				idMas: '3',
				children: {
					'9': {
						idMas: '9',
						idParent: '3',
						children: {
							'11': {
								idMas: '11',
								idParent: '9',
								children: {},
							},
						},
					},
					'12': {
						idMas: '12',
						idParent: '3',
						children: {},
					},
				},
			},
		};
		expect(flattenTree(input)).toEqual(output);
	});
});

describe('getTree', () => {
	it('should return the right tree', () => {
		const input = [
			{ idMas: '1' },
			{ idMas: '2' },
			{ idMas: '3' },
			{ idMas: '4', idParent: '1' },
			{ idMas: '5', idParent: '1' },
			{ idMas: '6', idParent: '1' },
			{ idMas: '7', idParent: '2' },
			{ idMas: '8', idParent: '2' },
			{ idMas: '9', idParent: '3' },
			{ idMas: '10', idParent: '8' },
			{ idMas: '11', idParent: '9' },
			{ idMas: '12', idParent: '3' },
		];
		const output = {
			'1': {
				idMas: '1',
				children: {
					'4': {
						idMas: '4',
						idParent: '1',
						children: {},
						isPresentational: false,
						rangeType: undefined,
					},
					'5': {
						idMas: '5',
						idParent: '1',
						children: {},
						isPresentational: false,
						rangeType: undefined,
					},
					'6': {
						idMas: '6',
						idParent: '1',
						children: {},
						isPresentational: false,
						rangeType: undefined,
					},
				},
				isPresentational: false,
				rangeType: undefined,
			},
			'2': {
				idMas: '2',
				children: {
					'7': {
						idMas: '7',
						idParent: '2',
						children: {},
						isPresentational: false,
						rangeType: undefined,
					},
					'8': {
						idMas: '8',
						idParent: '2',
						children: {
							'10': {
								idMas: '10',
								idParent: '8',
								children: {},
								isPresentational: false,
								rangeType: undefined,
							},
						},
						isPresentational: false,
						rangeType: undefined,
					},
				},
				isPresentational: false,
				rangeType: undefined,
			},
			'3': {
				idMas: '3',
				children: {
					'9': {
						idMas: '9',
						idParent: '3',
						children: {
							'11': {
								idMas: '11',
								idParent: '9',
								children: {},
								isPresentational: false,
								rangeType: undefined,
							},
						},
						isPresentational: false,
						rangeType: undefined,
					},
					'12': {
						idMas: '12',
						idParent: '3',
						children: {},
						isPresentational: false,
						rangeType: undefined,
					},
				},
				isPresentational: false,
				rangeType: undefined,
			},
		};
		expect(getTree(input, undefined, {})).toEqual(output);
	});
});

describe('getLabelsFromParent', () => {
	it('should return the labels for a SIMS linked to an operation', () => {
		/**
		 * @type {import('js/types').Operation}
		 */
		const input = {
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
		};
		expect(getLabelsFromParent(input)).toEqual({
			labelLg1: 'prefLabelLg1 SIMS',
			labelLg2: "SIMS de l'opération prefLabelLg2",
		});
	});
	it('should return the labels for a SIMS linked to an series', () => {
		/**
		 * @type {import('js/types').Series}
		 */
		const input = {
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
		};
		expect(getLabelsFromParent(input, 'series')).toEqual({
			labelLg1: 'prefLabelLg1 SIMS',
			labelLg2: 'SIMS de la série prefLabelLg2',
		});
	});
	it('should return the labels for a SIMS linked to an indicator', () => {
		/**
		 * @type {import('js/types').Indicator}
		 */
		const input = {
			prefLabelLg1: 'prefLabelLg1',
			prefLabelLg2: 'prefLabelLg2',
		};
		expect(getLabelsFromParent(input, 'indicator')).toEqual({
			labelLg1: 'prefLabelLg1 SIMS',
			labelLg2: "SIMS de l'indicateur prefLabelLg2",
		});
	});
});
