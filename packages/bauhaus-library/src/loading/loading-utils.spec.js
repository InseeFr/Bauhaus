import { getText } from './loading-utils';

const D = { loadableLoading: 'loadableLoading' };
describe('getText', () => {
	it("default value should return same text as 'loading' value", () => {
		expect(getText('', D)).toEqual(getText('loading', D));
	});
});
