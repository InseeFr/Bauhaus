import * as reducer from './current';
import {
	LOAD_OPERATIONS_SIMS_SUCCESS,
	SAVE_OPERATIONS_SIMS,
	SAVE_OPERATIONS_SIMS_SUCCESS,
} from '../actions/constants';

describe('current reducer', () => {
	[
		{
			method: 'operationsSimsCurrent',
			returnPayload: [LOAD_OPERATIONS_SIMS_SUCCESS, SAVE_OPERATIONS_SIMS],
			returnEmpty: [SAVE_OPERATIONS_SIMS_SUCCESS],
		},
	].forEach((configuration) => {
		describe(configuration.method, () => {
			configuration.returnPayload.forEach((action) => {
				it(action, () => {
					expect(
						//@ts-ignore
						reducer[configuration.method]('state', {
							type: action,
							payload: 'payload',
						}),
					).toEqual('payload');
				});
			});
			configuration.returnEmpty.forEach((action) => {
				it(action, () => {
					expect(
						//@ts-ignore
						reducer[configuration.method]('state', {
							type: action,
							payload: 'payload',
						}),
					).toEqual({});
				});
			});
		});
	});
});
