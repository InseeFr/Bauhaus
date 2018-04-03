import { saveSecondLang } from './';
import * as A from 'js/actions/constants';

describe('saveSecondLang', () => {
	test('should return the right payload', () => {
		expect(saveSecondLang({ target: { checked: true } })).toEqual({
			payload: true,
			type: A.SAVE_SECOND_LANG,
		});
	});
});
