import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { MODULE, PRIVILEGE, STRATEGY } from '@sdk/users-api';

import configureStore from '../../redux/configure-store';
import { AuthDumb, hasAccessToModule } from './auth';

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
			</Provider>,
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
			</Provider>,
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
			</Provider>,
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
			</Provider>,
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
			</Provider>,
		);
		expect(container.innerHTML).toEqual('fallback');
	});
});

describe('hasAccessToModule', () => {
	const makePrivilege = (
		application: MODULE,
		strategy: STRATEGY,
	): {
		application: MODULE;
		privileges: { privilege: PRIVILEGE; strategy: STRATEGY }[];
	} => ({
		application,
		privileges: [{ privilege: 'CREATE', strategy }],
	});

	it('returns false if privileges is undefined', () => {
		expect(hasAccessToModule('concepts', undefined)).toBe(false);
	});

	it('returns false if privileges is empty', () => {
		expect(hasAccessToModule('concepts', [])).toBe(false);
	});

	it('returns false if no privilege with strategy !== NONE', () => {
		const privileges = [makePrivilege('CONCEPT_CONCEPT', 'NONE')];
		expect(hasAccessToModule('concepts', privileges)).toBe(false);
	});

	it('returns true if at least one privilege has strategy !== NONE', () => {
		const privileges = [makePrivilege('CONCEPT_CONCEPT', 'ALL')];
		expect(hasAccessToModule('concepts', privileges)).toBe(true);
	});

	it('returns true if multiple privileges and one matches with non-NONE strategy', () => {
		const privileges = [
			makePrivilege('CONCEPT_CONCEPT', 'NONE'),
			makePrivilege('CONCEPT_CONCEPT', 'ALL'),
		];
		expect(hasAccessToModule('concepts', privileges)).toBe(true);
	});

	it('returns false for unknown module', () => {
		const privileges = [makePrivilege('CONCEPT_CONCEPT', 'ALL')];
		// @ts-expect-error test invalid input
		expect(hasAccessToModule('unknownModule', privileges)).toBe(false);
	});

	it('uses prefix matching', () => {
		const privileges = [makePrivilege('CONCEPT_CONCEPT', 'ALL')];
		expect(hasAccessToModule('concepts', privileges)).toBe(true);
	});

	it('returns false if prefix does not match module', () => {
		const privileges = [makePrivilege('STRUCTURE_STRUCTURE', 'ALL')];
		expect(hasAccessToModule('concepts', privileges)).toBe(false);
	});
});
