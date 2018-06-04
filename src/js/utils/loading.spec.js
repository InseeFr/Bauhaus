import { getText } from './loading';

describe('getText', () => {
	it("default value should return same text as 'loading' value", () => {
		expect(getText('')).toEqual(getText('loading'));
	});
});
