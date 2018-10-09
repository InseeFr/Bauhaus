import { isDateIn, isOutOfDate, stringToDate, toISOString } from './moment';

describe('is date in', () => {
	it('returns true if the start and end dates are null', () => {
		const toTest = '2017-06-25T10:51:47.812';
		expect(isDateIn(toTest, null, null)).toBe(true);
	});

	it('returns true if the dates match', () => {
		const toTest = '2017-07-15T10:51:47.812';
		const start = '2017-07-01T10:51:47.812';
		const end = '2017-07-31T10:51:47.812';
		expect(isDateIn(toTest, start, end)).toBe(true);
	});

	it('returns false if the dates do not match', () => {
		const toTest = '2017-06-25T10:51:47.812';
		const start = '2017-07-01T10:51:47.812';
		const end = '2017-07-31T10:51:47.812';
		expect(isDateIn(toTest, start, end)).toBe(false);
	});
});

describe('has date passed', () => {
	it('returns false if the end date is null', () => {
		expect(isOutOfDate(null)).toBe(false);
	});

	it('returns false if the date has not passed', () => {
		const end = '2099-07-31T10:51:47.812';
		expect(isOutOfDate(end)).toBe(false);
	});

	it('returns true if the date has passed', () => {
		const end = '2000-07-31T10:51:47.812';
		expect(isOutOfDate(end)).toBe(true);
	});
});

['browserLanguage', 'language'].forEach(property => {
	test(`should return the french version when the navigator.${property} is FR`, () => {
		expect(stringToDate('1988-02-28T10:51:47.812', 'fr')).toEqual('28/02/1988');
	});

	test(`should return the english version when the navigator.${property} is EN`, () => {
		expect(stringToDate('1988-02-28T10:51:47.812'), 'en').toEqual('02/28/1988');
	});
});

describe('toISOString', () => {
	it('should return the right ISO representation of a date when the lang is french', () => {
		expect(toISOString('01/02/2018', 'fr')).toEqual(
			expect.stringMatching(/^2018-02-01/)
		);
	});
	it('should return the right ISO representation of a date when the lang is english', () => {
		expect(toISOString('01/02/2018', 'en')).toEqual(
			expect.stringMatching(/^2018-01-02/)
		);
	});
});
