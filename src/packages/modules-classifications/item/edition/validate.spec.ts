import { validate } from './validate';

describe('validation', function () {
	it('should return an error for prefLabelLg1 and prefLabelLg2', function () {
		expect(
			validate({
				prefLabelLg1: '',
				prefLabelLg2: '',
			}),
		).toEqual({
			errorMessage: [
				'The property <strong>Intitulé</strong> is required.',
				'The property <strong>Title</strong> is required.',
			],
			fields: {
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
				prefLabelLg2: 'The property <strong>Title</strong> is required.',
			},
		});
	});
	it('should return an error if altLabelsLg1_ is too long', function () {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
				altLabelsLg1_:
					'a way way way way way way way way way way way way way way way way too long string',
			}),
		).toEqual({
			errorMessage: ['Truc'],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
				altLabelsLg1_: 'Truc',
			},
		});
	});
	it('should return no error', function () {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
			}),
		).toEqual({
			errorMessage: [],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
			},
		});
	});
});
