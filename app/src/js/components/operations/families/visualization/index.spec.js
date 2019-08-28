import { mapStateToProps } from './index';

describe('FamilyVisualizationContainer', () => {
	it('should return families if available', () => {
		const result = mapStateToProps(
			{
				app: {
					secondLang: 'secondLang',
					lg1: 'lg1',
					lg2: 'lg2',
				},
				operationsFamiliesCurrent: { id: 'id' },
			},
			{ match: { params: { id: '1' } } }
		);
		expect(result).toEqual({
			family: {},
			id: '1',
			langs: { lg1: 'lg1', lg2: 'lg2' },
			secondLang: 'secondLang',
		});
	});
	it('if the id of the family is not defined should return an empty object', () => {
		const result = mapStateToProps(
			{
				app: {
					secondLang: 'secondLang',
					lg1: 'lg1',
					lg2: 'lg2',
				},
				operationsFamiliesCurrent: { value: 'value' },
			},
			{ match: { params: { id: '1' } } }
		);
		expect(result).toEqual({
			family: {},
			id: '1',
			langs: { lg1: 'lg1', lg2: 'lg2' },
			secondLang: 'secondLang',
		});
	});
});
