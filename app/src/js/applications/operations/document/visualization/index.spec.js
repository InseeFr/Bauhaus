import { mapStateToProps } from './index';
const state = {
	operationsCurrentDocument: {
		results: {
			id: 1,
		},
	},
	app: {
		lg1: 'lg1',
		lg2: 'lg2',
		secondLang: true,
	},
	operationsCodesList: {
		results: {
			'ISO-639': {codes: []}
		}
	}
};

describe('mapStateToProps', () => {
	it('should return the right object', () => {
		const props = { match: { params: { id: 1 } } };
		const output = mapStateToProps(state, props);
		expect(output).toEqual({
			document: {
				id: 1,
			},
			id: 1,
			langOptions: {codes: []},
			langs: {
				lg1: 'lg1',
				lg2: 'lg2',
			},
			secondLang: true,
		});
	});
	it('should return an empty document if the id is not the same', () => {
		const props = { match: { params: { id: 2 } } };
		const output = mapStateToProps(state, props);
		expect(output).toEqual({
			document: {},
			id: 2,
			langOptions: {codes: []},
			langs: {
				lg1: 'lg1',
				lg2: 'lg2',
			},
			secondLang: true,
		});
	});
});
