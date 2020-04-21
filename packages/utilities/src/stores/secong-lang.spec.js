import { SAVE_SECOND_LANG, saveSecondLang } from './second-lang';

describe('saveSecondLang', () => {
	test('should return the right payload', () => {
		expect(saveSecondLang({ target: { checked: true } })).toEqual({
			payload: true,
			type: SAVE_SECOND_LANG,
		});
	});
});
