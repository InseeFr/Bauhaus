import { mapStateToProps } from './hoc';

describe('mapStateToProps', () => {
	it('should return the auth object with a role', () => {
		const input = {
			app: {
				auth: {
					type: 'type',
					user: {
						stamp: 'stamp',
						roles: 'roles',
					},
				},
			},
		};
		const output = { authType: 'type', roles: 'roles' };
		expect(mapStateToProps(input)).toEqual(output);
	});
	it('should return the auth object without a role', () => {
		const input = {
			app: {
				auth: {
					type: 'type',
					user: {
						roles: 'roles',
					},
				},
			},
		};
		const output = { authType: 'type', roles: null };
		expect(mapStateToProps(input)).toEqual(output);
	});
});
