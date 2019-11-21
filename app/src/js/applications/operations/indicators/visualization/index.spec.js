import { mapStateToProps } from './index';
import { CL_FREQ } from 'js/actions/constants/codeList';

describe('IndicatorVisualizationContainer', () => {
	it('should return an indicator if available', () => {
		const result = mapStateToProps(
			{
				app: { lg1: 'lg1', lg2: 'lg2', secondLang: true },
				operationsIndicatorsCurrent: {
					id: '1',
					accrualPeriodicityCode: 'code',
				},
				operationsOrganisations: { results: ['results'] },
				operationsCodesList: {
					results: { [CL_FREQ]: { codes: [{ code: 'code' }] } },
				},
			},
			{ match: { params: { id: '1' } } }
		);
		expect(result).toEqual({
			frequency: { code: 'code' },
			id: '1',
			object: { accrualPeriodicityCode: 'code', id: '1' },
			langs: { lg1: 'lg1', lg2: 'lg2' },
			organisations: ['results'],
			secondLang: true,
		});
	});
	it('should return an empty indicator if the id is not the same', () => {
		const result = mapStateToProps(
			{
				app: { lg1: 'lg1', lg2: 'lg2', secondLang: true },
				operationsIndicatorsCurrent: {
					id: '2',
					accrualPeriodicityCode: 'code',
				},
				operationsOrganisations: { results: ['results'] },
				operationsCodesList: {
					results: { [CL_FREQ]: { codes: [{ code: 'code' }] } },
				},
			},
			{ match: { params: { id: '1' } } }
		);
		expect(result).toEqual({
			frequency: { code: 'code' },
			id: '1',
			object: {},
			langs: { lg1: 'lg1', lg2: 'lg2' },
			organisations: ['results'],
			secondLang: true,
		});
	});
});
