import * as reducer from './current';
import * as A from '../../actions/constants';

describe('current reducer', () => {
	[
		{
			method: 'operationsSimsCurrent',
			returnPayload: ['LOAD_OPERATIONS_SIMS_SUCCESS', 'SAVE_OPERATIONS_SIMS'],
			returnEmpty: ['SAVE_OPERATIONS_SIMS_SUCCESS'],
		},
	].forEach((configuration) => {
		describe(configuration.method, () => {
			configuration.returnPayload.forEach((action) => {
				it(action, () => {
					expect(
						reducer[configuration.method]('state', {
							type: A[action],
							payload: 'payload',
						})
					).toEqual('payload');
				});
			});
			configuration.returnEmpty.forEach((action) => {
				it(action, () => {
					expect(
						reducer[configuration.method]('state', {
							type: A[action],
							payload: 'payload',
						})
					).toEqual({});
				});
			});
		});
	});
});
