import { validate } from './validation';

describe('validate', () => {
	it('should return an error if the prefLabelLg1 is not defined', () => {
		expect(validate({ prefLabelLg2: 'prefLabelLg2' })).toBe(
			'The title is required'
		);
	});
	it('should return an error if the prefLabelLg2 is not defined', () => {
		expect(validate({ prefLabelLg1: 'prefLabelLg1' })).toBe(
			'The title is required'
		);
	});
	it('should return nothing if there is no errors', () => {
		expect(
			validate({ prefLabelLg1: 'prefLabelLg1', prefLabelLg2: 'prefLabelLg2' })
		).toBeUndefined();
	});
});
