import { getTree } from './index';

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
