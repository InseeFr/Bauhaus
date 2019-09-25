import { AuthDumb, mapStateToProps } from './auth';

describe('AuthDumb', () => {
	it('should the fallback if the user is not authorized', () => {
		expect(
			AuthDumb({
				children: 'children',
				fallback: 'fallback',
				userRoles: ['roles'],
				roles: ['roles1'],
			})
		).toEqual('fallback');
	});
	it('should the children if the user is authorized', () => {
		expect(
			AuthDumb({
				children: 'children',
				fallback: 'fallback',
				userRoles: ['roles'],
				roles: ['roles'],
			})
		).toEqual('children');
	});
});

describe('mapStateToProps', () => {
	it('should return the user roles', () => {
		const state = {
			app: {
				auth: {
					user: {
						roles: 'roles',
					},
				},
			},
		};
		expect(mapStateToProps(state)).toEqual({
			userRoles: 'roles',
		});
	});
});
