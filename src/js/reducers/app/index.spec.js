import reducerApp from './';
import * as A from 'js/actions/constants';

describe('reducerApp', () => {
	test('failure action type', () => {
		const action = { type: 'XXX_FAILURE', payload: 'payload' };
		const result = reducerApp({ state: 'previous' }, action);
		expect(result).toEqual({ state: 'previous', error: true });
	});

	test('action SAVE_SECOND_LANG', () => {
		const action = { type: A.SAVE_SECOND_LANG, payload: false };
		const result = reducerApp({ state: 'previous' }, action);
		expect(result).toEqual({ state: 'previous', secondLang: false });
	});

	test('action CHECK_AUTH_SUCCESS', () => {
		const action = { type: A.CHECK_AUTH_SUCCESS, payload: 'toto' };
		const result = reducerApp(
			{ branch: 'previous', auth: { type: 'Oauth2' } },
			action
		);
		expect(result).toEqual({
			branch: 'previous',
			auth: { type: 'Oauth2', user: 'toto' },
		});
	});
});
