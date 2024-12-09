import { Rubric, Sims } from '../../model/Sims';
import { rangeType } from '../utils/msd';
import { HELP_COLLAPSED, getParentUri, hasLabelLg2, isOpen } from './utils';

const { RICH_TEXT, TEXT, REPORTED_ATTRIBUTE } = rangeType;

describe('isOpen', () => {
	beforeEach(() => {
		localStorage.setItem(
			HELP_COLLAPSED,
			JSON.stringify({
				2: true,
				3: false,
			}),
		);
	});
	it('should return false as a default value', () => {
		const input = '1';
		const output = isOpen(input);
		expect(output).toBeFalsy();
	});
	it('should return false if the item is closed', () => {
		const input = '3';
		const output = isOpen(input);
		expect(output).toBeFalsy();
	});

	it('should return true if the item is opened', () => {
		const input = '2';
		const output = isOpen(input);
		expect(output).toBeTruthy();
	});
});

describe('hasLabelLg2', () => {
	it('should return true if the section is a TEXT', () => {
		const input = { rangeType: TEXT } as unknown as Rubric;
		expect(hasLabelLg2(input)).toBeTruthy();
	});
	it('should return true if the section is a RICH_TEXT', () => {
		const input = { rangeType: RICH_TEXT } as unknown as Rubric;
		expect(hasLabelLg2(input)).toBeTruthy();
	});
	it('should return false if the section is a REPORTED_ATTRIBUTE', () => {
		const input = { rangeType: REPORTED_ATTRIBUTE } as unknown as Rubric;
		expect(hasLabelLg2(input)).toBeFalsy();
	});
});

describe('getParentUri', () => {
	it('should return a uri of an operation', () => {
		expect(getParentUri({ idOperation: '1' } as unknown as Sims)).toBe(
			`/operations/operation/1`,
		);
	});
	it('should return a uri of an series', () => {
		expect(getParentUri({ idSeries: '1' } as unknown as Sims)).toBe(
			`/operations/series/1`,
		);
	});
	it('should return a uri of an indicator', () => {
		expect(getParentUri({ idIndicator: '1' } as unknown as Sims)).toBe(
			`/operations/indicator/1`,
		);
	});
	it('should return undefined', () => {
		expect(getParentUri({} as unknown as Sims)).toBeUndefined();
	});
});
