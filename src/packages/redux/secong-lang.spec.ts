import { SAVE_SECOND_LANG, saveSecondLang, getSecondLang } from './second-lang';

describe('saveSecondLang', () => {
	test('should return the right payload', () => {
		expect(saveSecondLang({ target: { checked: true } })).toEqual({
			payload: true,
			type: SAVE_SECOND_LANG,
		});
	});
});
describe('getSecondLang', () => {
	test('should return the secondLang', () => {
		expect(getSecondLang({ app: { secondLang: true } } as any)).toEqual(true);
	});
});
