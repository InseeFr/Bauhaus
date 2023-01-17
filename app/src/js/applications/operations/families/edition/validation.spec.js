import { validate } from './validation';

describe('validation', function() {
	it('should return an error for prefLabelLg1', function() {
		expect(validate({ prefLabelLg2: 'prefLabelLg2' })).toEqual({
			errorMessage: ['The property <strong>Intitulé</strong> is required.'],
			fields: {
				'prefLabelLg1': true,
				'prefLabelLg2': false,
			},
		});
	});
	it('should return an error for prefLabelLg2', function() {
		expect(validate({ prefLabelLg1: 'prefLabelLg1' })).toEqual({
			errorMessage: ['The property <strong>Title</strong> is required.'],
			fields: {
				'prefLabelLg1': false,
				'prefLabelLg2': true,
			},
		});
	});
	it('should return an error for prefLabelLg1 and prefLabelLg2', function() {
		expect(validate({ })).toEqual({
			errorMessage: [
				'The property <strong>Intitulé</strong> is required.',
				'The property <strong>Title</strong> is required.'
			],
			fields: {
				'prefLabelLg1': true,
				'prefLabelLg2': true,
			},
		});
	});
	it('should return no errors', function() {
		expect(validate({
			prefLabelLg1: 'prefLabelLg2',
			prefLabelLg2: 'prefLabelLg2'
		})).toEqual({
			errorMessage: [],
			fields: {
				'prefLabelLg1': false,
				'prefLabelLg2': false,
			},
		});
	});
});
