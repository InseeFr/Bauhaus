import { saveUserProps, checkAuth } from './';
import * as A from 'js/actions/constants';

describe('saveUserProps', () => {
	test('should return the right payload', () => {
		expect(saveUserProps({ target: { checked: true } })).toEqual({
			payload: { target: { checked: true } },
			type: A.SAVE_USER_PROPS,
		});
	});
});
describe('checkAuth', () => {
	test('should return the right payload', () => {
		expect(checkAuth({ target: { checked: true } })).toEqual({
			payload: { target: { checked: true } },
			type: A.CHECK_AUTH,
		});
	});
});
