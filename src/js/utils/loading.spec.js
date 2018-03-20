import { getColor, getText } from './loading';

describe('getColor', () => {
	it("default value should return same color as 'concepts' value", () => {
		expect(getColor('')).toEqual(getColor('concepts'));
	});
});

describe('getText', () => {
	it("default value should return same text as 'loading' value", () => {
		expect(getText('')).toEqual(getText('loading'));
	});
});
