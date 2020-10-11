import { mapStateToProps } from './index';
import { CL_FREQ } from 'js/actions/constants/codeList';

describe('OperationsIndicatorsEditionContainer', () => {
	it('should return an empty indicator if the id is not the same', () => {
		const result = mapStateToProps(
			{
				stampList: { results: ['STAMP1'] },
				app: { lg1: 'lg1', lg2: 'lg2', secondLang: true },
				operationsIndicatorsCurrent: {
					id: '2',
					accrualPeriodicityCode: 'code',
				},
				operationsOrganisations: { results: ['results'] },
				operationsCodesList: {
					results: { [CL_FREQ]: { codes: [{ code: 'code' }] } },
				},
				operationsAsyncTask: false,
				operationsIndicatorsList: { results: ['operationsIndicatorsList'] },
				operationsSeriesList: { results: ['operationsSeriesList'] },
			},
			{ match: { params: { id: '2' } } }
		);
		expect(result).toEqual({
			frequencies: { codes: [{ code: 'code' }] },
			id: '2',
			indicator: { accrualPeriodicityCode: 'code', id: '2' },
			indicators: ['operationsIndicatorsList'],
			langs: { lg1: 'lg1', lg2: 'lg2' },
			operationsAsyncTask: false,
			organisations: ['results'],
			series: ['operationsSeriesList'],
		});
	});
});
