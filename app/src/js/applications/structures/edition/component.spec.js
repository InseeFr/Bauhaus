import { validate } from './component';

describe('<Edition />', () => {
	it('should return an error if the id is not defined', () => {
		expect(validate({})).toBe('The identifier is required');
	});
	it('should return an error if the labelLg1 is not defined', () => {
		expect(
			validate({
				identifiant: '1',
			})
		).toBe('The label is required');
	});
	it('should return an error if the labelLg2 is not defined', () => {
		expect(
			validate({
				identifiant: '1',
				labelLg1: 'label',
			})
		).toBe('The label is required');
	});
	it('should not return any error', () => {
		expect(
			validate({
				identifiant: '1',
				labelLg1: 'label',
				labelLg2: 'label',
			})
		).toBeUndefined();
	});
});
