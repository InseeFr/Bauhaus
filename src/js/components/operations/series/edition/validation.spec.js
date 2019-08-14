import { validate } from './validation';

describe('validation series', () => {
	it('should return an error if the prefLabelLg1 is not defined', () => {
		expect(
			validate({ prefLabelLg2: 'prefLabelLg2', family: 'family' })
		).toEqual({
			errorMessage: 'The title is required',
			fields: {
				family: false,
				prefLabelLg1: true,
				prefLabelLg2: false,
			},
		});
	});
	it('should return an error if the prefLabelLg2 is not defined', () => {
		expect(
			validate({ prefLabelLg1: 'prefLabelLg1', family: 'family' })
		).toEqual({
			errorMessage: 'The title is required',
			fields: {
				family: false,
				prefLabelLg1: false,
				prefLabelLg2: true,
			},
		});
	});
	it('should return an error if the family is not defined', () => {
		expect(
			validate({ prefLabelLg1: 'prefLabelLg1', prefLabelLg2: 'prefLabelLg2' })
		).toEqual({
			errorMessage: 'The family is required',
			fields: {
				family: true,
				prefLabelLg1: false,
				prefLabelLg2: false,
			},
		});
	});
	it('should not return any errors', () => {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
				family: 'family',
			})
		).toEqual({
			errorMessage: '',
			fields: {
				family: false,
				prefLabelLg1: false,
				prefLabelLg2: false,
			},
		});
	});
});
