import { AuthDumb, mapStateToProps } from './auth';
import { render } from '@testing-library/react';
import { LOADING } from '../../sdk/constants';
import { ReduxModel } from '../../redux/model';

describe('AuthDumb', () => {
	it('should return the fallback if the user is not authorized', () => {
		const { container } = render(
			<AuthDumb
				fallback="fallback"
				userRoles={['roles']}
				roles={['roles1']}
				loadUserStamp={jest.fn()}
			>
				Children
			</AuthDumb>
		);
		expect(container.innerHTML).toEqual('fallback');
	});
	it('should return the children if the user is authorized', () => {
		const { container } = render(
			<AuthDumb
				fallback="fallback"
				userRoles={['roles']}
				roles={['roles']}
				loadUserStamp={jest.fn()}
			>
				Children
			</AuthDumb>
		);
		expect(container.innerHTML).toEqual('Children');
	});

	it('should return the children if the user is authorized via a complementary check', () => {
		const { container } = render(
			<AuthDumb
				fallback="fallback"
				userRoles={['roles']}
				roles={[['roles', () => true]]}
				loadUserStamp={jest.fn()}
				userStamp="stamp"
			>
				Children
			</AuthDumb>
		);
		expect(container.innerHTML).toEqual('Children');
	});

	it('should return the fallback if the user is not authorized via a complementary check', () => {
		const { container } = render(
			<AuthDumb
				fallback="fallback"
				userRoles={['roles']}
				roles={[['roles', () => false]]}
				loadUserStamp={jest.fn()}
			>
				Children
			</AuthDumb>
		);
		expect(container.innerHTML).toEqual('fallback');
	});

	it('should return the fallback if the user does not have a stamp via a complementary check', () => {
		const { container } = render(
			<AuthDumb
				fallback="fallback"
				userRoles={['roles']}
				roles={[['roles', () => true]]}
				loadUserStamp={jest.fn()}
			>
				Children
			</AuthDumb>
		);
		expect(container.innerHTML).toEqual('fallback');
	});
});

describe('mapStateToProps', () => {
	it('should return the user object', () => {
		const state = {
			app: {
				auth: {
					type: 'type',
					user: {
						roles: ['roles'],
						stamp: 'stamp',
					},
				},
			},
			users: {
				status: LOADING,
				results: {
					stamp: 'stamp',
				},
			},
		} as unknown as ReduxModel;
		expect(mapStateToProps(state)).toEqual({
			userRoles: ['roles'],
			userStamp: 'stamp',
			isLoading: true,
		});
	});
});