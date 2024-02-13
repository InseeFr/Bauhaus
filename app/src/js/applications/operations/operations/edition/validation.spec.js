import { validate } from './validation';

describe('validate', function() {
	it('should return an error for prefLabelLg1', function() {
		expect(
            validate({
                prefLabelLg1: '',
                prefLabelLg2: 'prefLabelLg2',
                series: {id: 'i'},
            })
        ).toEqual({
			errorMessage: [
                'The property <strong>Intitulé</strong> is required.',
            ],
			fields: {
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
				prefLabelLg2: '',
                series: '',
			},
		});
	});
	it('should return an error for prefLabelLg2', function() {
		expect(
            validate({
                prefLabelLg1: 'prefLabelLg1',
                prefLabelLg2: '',
                series: {id: 'i'},
            })
        ).toEqual({
			errorMessage: [
                'The property <strong>Title</strong> is required.',
            ],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: 'The property <strong>Title</strong> is required.',
                series: '',
			},
		});
	});
	it('should return an error for series', function() {
		expect(
            validate({
                prefLabelLg1: 'prefLabelLg1',
                prefLabelLg2: 'prefLabelLg2'
            })
        ).toEqual({
			errorMessage: ['The property <strong>Séries</strong> is required.'],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
                series: 'The property <strong>Séries</strong> is required.'
			},
		});
	});
	it('should return no error', function() {
		expect(
			validate({
                prefLabelLg1: 'prefLabelLg1',
                prefLabelLg2: 'prefLabelLg2',
                series: {id: 'i'},
            })
		).toEqual({
			errorMessage: [],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
                series: ''
			},
		});
	});
});
