import React from 'react';
import { AuthDumb, mapStateToProps } from './auth';
import { LOADING } from '../../stores/constants';
import { render } from '@testing-library/react';

describe('AuthDumb', () => {
	it('should return the fallback if the user is not authorized', () => {
		const { container } = render(
			<AuthDumb
				children={'children'}
				fallback={'fallback'}
				userRoles={['roles']}
				roles={['roles1']}
				loadUserStamp={jest.fn()}
			>Children</AuthDumb>);
		expect(container.innerHTML).toEqual('fallback');
	});
	it('should return the children if the user is authorized', () => {
		const { container } = render(
			<AuthDumb
				children={'children'}
				fallback={'fallback'}
				userRoles={['roles']}
				roles={['roles']}
				loadUserStamp={jest.fn()}
			>Children</AuthDumb>);
		expect(container.innerHTML).toEqual('Children');
	});

	it('should return the children if the user is authorized via a complementary check', () => {
		const { container } = render(
			<AuthDumb
				children={'children'}
				fallback={'fallback'}
				userRoles={['roles']}
				roles={[['roles', () => true]]}
				loadUserStamp={jest.fn()}
			>Children</AuthDumb>);
		expect(container.innerHTML).toEqual('Children');
	});

	it('should return the fallback if the user is not authorized via a complementary check', () => {
		const { container } = render(
			<AuthDumb
				children={'children'}
				fallback={'fallback'}
				userRoles={['roles']}
				roles={[['roles', () => false]]}
				loadUserStamp={jest.fn()}
			>Children</AuthDumb>);
		expect(container.innerHTML).toEqual('fallback');
	});
});

describe('mapStateToProps', () => {
	it('should return the user object', () => {
		const state = {
			app: {
				auth: {
					user: {
						roles: 'roles',
					},
				}
			},
			users: {
				status: LOADING,
				results: {
					stamp: 'stamp'
				}
			}
		};
		expect(mapStateToProps(state)).toEqual({
			userRoles: 'roles',
			userStamp: 'stamp',
			isLoading: true,
		});
	});
});
