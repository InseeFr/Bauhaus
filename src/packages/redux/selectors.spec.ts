import { ReduxModel } from './model';
import * as selector from './selectors';

describe('getPermission', () => {
	it('should return the permission object', () => {
		const input = {
			app: {
				auth: {
					type: 'authType',
					user: {
						roles: 'roles',
						stamp: 'stamp',
					},
				},
			},
		};

		const output = {
			authType: 'authType',
			roles: 'roles',
			stamp: 'stamp',
		};
		expect(selector.getPermission(input as unknown as ReduxModel)).toEqual(
			output,
		);
	});
});
