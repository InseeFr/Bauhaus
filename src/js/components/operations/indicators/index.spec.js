import { mapStateToProps } from './index';

describe('IndicatorsHomeContainer', () => {
	it('should return indicators if available', () => {
		const result = mapStateToProps({});
		expect(result).toEqual({ indicators: [], status: 'NOT_LOADED' });
	});
	it('if the id of the indicators is not defined should return an empty object', () => {
		const result = mapStateToProps({
			operationsIndicatorsList: {
				results: 'results',
				status: 'LOADED',
				err: 'err',
			},
			app: {
				auth: {
					type: 'authType',
					user: {
						roles: 'roles',
						stamp: 'stamp',
					},
				},
			},
		});
		expect(result).toEqual({
			err: 'err',
			indicators: 'results',
			permission: { authType: 'authType', roles: 'roles', stamp: 'stamp' },
			status: 'LOADED',
		});
	});
});
