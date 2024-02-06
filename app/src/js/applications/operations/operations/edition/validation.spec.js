import { validate } from './validation';

describe('validate', () => {
	it('should return an error if the prefLabelLg1 is not defined', () => {
		expect(validate({ prefLabelLg1: '', prefLabelLg2: 'prefLabelLg2', series: {id: "i"} })).toEqual({
			errorMessage: ['The property <strong>Intitulé</strong> is required.'],
			fields: {
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
				prefLabelLg2: '',
                series: '',
			},
		});
	});
	it('should return an error if the prefLabelLg2 is not defined', () => {
		expect(validate({ prefLabelLg1: 'prefLabelLg1', prefLabelLg2: '', series: {id: "i"} })).toEqual({
			errorMessage: ['The property <strong>Title</strong> is required.'],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: 'The property <strong>Title</strong> is required.',
                series: '',
			},
		});
	});
	it('should return an error if the series is not defined', () => {
		expect(validate({ prefLabelLg1: 'prefLabelLg1',  prefLabelLg2: 'prefLabelLg2' })).toEqual({
			errorMessage: ['The property <strong>Series</strong> is required.'],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
                series: 'The property <strong>Series</strong> is required.'
			},
		});
	});
	it('should return nothing if there is no errors', () => {
		expect(
			validate({ prefLabelLg1: 'prefLabelLg1', prefLabelLg2: 'prefLabelLg2', series: {id: "i"} })
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
