import { render } from '@testing-library/react';
import { AuthDumb } from './auth';
import configureStore from '../../redux/configure-store';
import { Provider } from 'react-redux';

describe('AuthDumb', () => {
	it('should return the fallback if the user is not authorized', () => {
		const store = configureStore({
			app: {
				auth: {
					type: 'type',
					user: {
						roles: ['roles1'],
						stamp: 'stamp',
					},
				},
			},
		});

		const { container } = render(
			<Provider store={store}>
				<AuthDumb fallback="fallback" roles={['roles']}>
					Children
				</AuthDumb>
			</Provider>
		);
		expect(container.innerHTML).toEqual('fallback');
	});
	it('should return the children if the user is authorized', () => {
		const store = configureStore({
			app: {
				auth: {
					type: 'type',
					user: {
						roles: ['roles1'],
						stamp: 'stamp',
					},
				},
			},
		});

		const { container } = render(
			<Provider store={store}>
				<AuthDumb fallback="fallback" roles={['roles1']}>
					Children
				</AuthDumb>
			</Provider>
		);
		expect(container.innerHTML).toEqual('Children');
	});

	it('should return the children if the user is authorized via a complementary check', () => {
		const store = configureStore({
			app: {
				auth: {
					type: 'type',
					user: {
						roles: ['roles1'],
						stamp: 'stamp',
					},
				},
			},
		});

		const { container } = render(
			<Provider store={store}>
				<AuthDumb fallback="fallback" roles={[['roles1', () => true]]}>
					Children
				</AuthDumb>
			</Provider>
		);
		expect(container.innerHTML).toEqual('Children');
	});

	it('should return the fallback if the user is not authorized via a complementary check', () => {
		const store = configureStore({
			app: {
				auth: {
					type: 'type',
					user: {
						roles: ['roles1'],
						stamp: 'stamp',
					},
				},
			},
		});

		const { container } = render(
			<Provider store={store}>
				<AuthDumb fallback="fallback" roles={[['roles', () => false]]}>
					Children
				</AuthDumb>
			</Provider>
		);
		expect(container.innerHTML).toEqual('fallback');
	});

	it('should return the fallback if the user does not have a stamp via a complementary check', () => {
		const store = configureStore({
			app: {
				auth: {
					type: 'type',
					user: {
						roles: ['roles1'],
						stamp: 'stamp',
					},
				},
			},
		});

		const { container } = render(
			<Provider store={store}>
				<AuthDumb fallback="fallback" roles={[['roles', () => true]]}>
					Children
				</AuthDumb>
			</Provider>
		);
		expect(container.innerHTML).toEqual('fallback');
	});
});
