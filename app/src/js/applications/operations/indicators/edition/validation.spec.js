import { validate } from './validation';

describe('validate', () => {
	it('should return an error if the prefLabelLg1 is not defined', () => {
		expect(validate({ prefLabelLg2: 'prefLabelLg2' })).toEqual({
			errorMessage: 'The title is required',
			fields: {
				prefLabelLg1: true,
				prefLabelLg2: false,
			},
		});
	});
	it('should return an error if the prefLabelLg2 is not defined', () => {
		expect(validate({ prefLabelLg1: 'prefLabelLg1' })).toEqual({
			errorMessage: 'The title is required',
			fields: {
				prefLabelLg1: false,
				prefLabelLg2: true,
			},
		});
	});
	it('should return an error if the creators is not defined', () => {
		expect(validate({ prefLabelLg1: 'prefLabelLg1',  prefLabelLg2: 'prefLabelLg2' })).toEqual({
			errorMessage: 'The owner is required',
			fields: {
				prefLabelLg1: false,
				prefLabelLg2: false,
			},
		});
	});
	it('should return an error if the creators is an empty array', () => {
		expect(validate({ prefLabelLg1: 'prefLabelLg1',  prefLabelLg2: 'prefLabelLg2', creators: [] })).toEqual({
			errorMessage: 'The owner is required',
			fields: {
				prefLabelLg1: false,
				prefLabelLg2: false,
			},
		});
	});
	it('should return nothing if there is no errors', () => {
		expect(
			validate({ creators: ['a'], prefLabelLg1: 'prefLabelLg1', prefLabelLg2: 'prefLabelLg2' })
		).toEqual({
			errorMessage: '',
			fields: {
				prefLabelLg1: false,
				prefLabelLg2: false,
			},
		});
	});
});
