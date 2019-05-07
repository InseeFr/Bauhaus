import {
	hasLabelLg2,
	shouldDisplayDuplicateButton,
	isOpen,
	toggleOpen,
	HELP_COLLAPSED,
	getParentUri,
} from './utils';
import { rangeType } from 'js/utils/msd/';
const { RICH_TEXT, TEXT, DATE } = rangeType;

describe('isOpen', () => {
	beforeEach(() => {
		localStorage.setItem(
			HELP_COLLAPSED,
			JSON.stringify({
				2: true,
				3: false,
			})
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

describe('toggleOpen', () => {
	beforeEach(() => {
		localStorage.setItem(
			HELP_COLLAPSED,
			JSON.stringify({
				2: true,
				3: false,
			})
		);
	});
	it('should return call localStorage with true if the item is not present yet in the localStorage', () => {
		const input = 1;
		toggleOpen(input);
		expect(localStorage.setItem).toHaveBeenLastCalledWith(
			HELP_COLLAPSED,
			JSON.stringify({
				1: true,
				2: true,
				3: false,
			})
		);
	});
	it('should return call localStorage with false if the item is currently opened', () => {
		const input = 2;
		toggleOpen(input);
		expect(localStorage.setItem).toHaveBeenLastCalledWith(
			HELP_COLLAPSED,
			JSON.stringify({
				2: false,
				3: false,
			})
		);
	});

	it('should return  call localStorage with true if the item is currently closed', () => {
		const input = 3;
		toggleOpen(input);
		expect(localStorage.setItem).toHaveBeenLastCalledWith(
			HELP_COLLAPSED,
			JSON.stringify({
				2: true,
				3: true,
			})
		);
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
			siblingsWithoutSims: [],
			idOperation: 1,
		};
	});
});

describe('shouldDisplayDuplicateButton', () => {
	it('should return true if the section is a TEXT', () => {
		const input = { rangeType: TEXT };
		expect(hasLabelLg2(input)).toBeTruthy();
	});
	it('should return true if the section is a RICH_TEXT', () => {
		const input = { rangeType: RICH_TEXT };
		expect(hasLabelLg2(input)).toBeTruthy();
	});
	it('should return false if the section is a DATE', () => {
		const input = { rangeType: DATE };
		expect(hasLabelLg2(input)).toBeFalsy();
	});
});

describe('getParentUri', () => {
	it('should return a uri of an operation', () => {
		expect(getParentUri({ idOperation: '1' })).toBe(`/operations/operation/1`);
	});
	it('should return a uri of an series', () => {
		expect(getParentUri({ idSeries: '1' })).toBe(`/operations/serie/1`);
	});
	it('should return a uri of an indicator', () => {
		expect(getParentUri({ idIndicator: '1' })).toBe(`/operations/indicator/1`);
	});
	it('should return undefined', () => {
		expect(getParentUri({})).toBeUndefined();
	});
});
