import { validate } from './validation';

describe('validation', function () {
	it('should return an error for prefLabelLg1', function () {
		expect(
			validate({
				series: { id: 'i' },
				prefLabelLg1: '',
				prefLabelLg2: 'prefLabelLg2',
			}),
		).toEqual({
			errorMessage: ['The property <strong>Intitulé</strong> is required.'],
			fields: {
				series: '',
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
				prefLabelLg2: '',
			},
		});
	});
	it('should return an error for prefLabelLg2', function () {
		expect(
			validate({
				series: { id: 'i' },
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: '',
			}),
		).toEqual({
			errorMessage: ['The property <strong>Title</strong> is required.'],
			fields: {
				series: '',
				prefLabelLg1: '',
				prefLabelLg2: 'The property <strong>Title</strong> is required.',
			},
		});
	});
	it('should return an error for series', function () {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
			}),
		).toEqual({
			errorMessage: ['The property <strong>Serie</strong> is required.'],
			fields: {
				series: 'The property <strong>Serie</strong> is required.',
				prefLabelLg1: '',
				prefLabelLg2: '',
			},
		});
	});
	it('should return no error', function () {
		expect(
			validate({
				series: { id: 'i' },
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
			}),
		).toEqual({
			errorMessage: [],
			fields: {
				series: '',
				prefLabelLg1: '',
				prefLabelLg2: '',
			},
		});
	});
});
