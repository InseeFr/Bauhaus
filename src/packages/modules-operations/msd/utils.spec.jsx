import { rangeType } from '../utils/msd';
import {
	hasLabelLg2,
	shouldDisplayDuplicateButton,
	isOpen,
	HELP_COLLAPSED,
	getParentUri,
} from './utils';

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
		const input = 1;
		const output = isOpen(input);
		expect(output).toBeFalsy();
	});
	it('should return false if the item is closed', () => {
		const input = 3;
		const output = isOpen(input);
		expect(output).toBeFalsy();
	});

	it('should return true if the item is opened', () => {
		const input = 2;
		const output = isOpen(input);
		expect(output).toBeTruthy();
	});
});

describe('shouldDisplayDuplicateButton', () => {
	it('should return false if this is not an operation', () => {
		const input = {};
		expect(shouldDisplayDuplicateButton(input)).toBeFalsy();
	});
	it('should return false if this is an operation without any siblings SIMS-less', () => {
		const input = {
			idOperation: 1,
		};
		expect(shouldDisplayDuplicateButton(input)).toBeFalsy();
	});
	it('should return true if this is an operation with siblings without SIMS', () => {
		const input = {
			parentsWithoutSims: ['op'],
			idOperation: 1,
		};
		expect(shouldDisplayDuplicateButton(input)).toBeTruthy();
	});
});

describe('hasLabelLg2', () => {
	it('should return true if the section is a TEXT', () => {
		const input = { rangeType: TEXT };
		expect(hasLabelLg2(input)).toBeTruthy();
	});
	it('should return true if the section is a RICH_TEXT', () => {
		const input = { rangeType: RICH_TEXT };
		expect(hasLabelLg2(input)).toBeTruthy();
	});
	it('should return false if the section is a REPORTED_ATTRIBUTE', () => {
		const input = { rangeType: REPORTED_ATTRIBUTE };
		expect(hasLabelLg2(input)).toBeFalsy();
	});
});

describe('getParentUri', () => {
	it('should return a uri of an operation', () => {
		expect(getParentUri({ idOperation: '1' })).toBe(`/operations/operation/1`);
	});
	it('should return a uri of an series', () => {
		expect(getParentUri({ idSeries: '1' })).toBe(`/operations/series/1`);
	});
	it('should return a uri of an indicator', () => {
		expect(getParentUri({ idIndicator: '1' })).toBe(`/operations/indicator/1`);
	});
	it('should return undefined', () => {
		expect(getParentUri({})).toBeUndefined();
	});
});
