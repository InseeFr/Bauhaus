import { isDateIn, isOutOfDate, stringToDate } from './moment';

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

describe('convert stringDateTime to formatted date', () => {
	it('returns false if the date has not passed', () => {
		const date = '1988-02-28T10:51:47.812';
		expect(stringToDate(date, 'fr')).toEqual('28/02/1988');
	});

	it('returns true if the date has passed', () => {
		const date = '1988-02-28T10:51:47.812';
		expect(stringToDate(date, 'en')).toEqual('02/28/1988');
	});
});
