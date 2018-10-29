import { isOpen, toggleOpen, HELP_COLLAPSED } from './utils';

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
		const output = toggleOpen(input);
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
		const output = toggleOpen(input);
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
		const output = toggleOpen(input);
		expect(localStorage.setItem).toHaveBeenLastCalledWith(
			HELP_COLLAPSED,
			JSON.stringify({
				2: true,
				3: true,
			})
		);
	});
});
