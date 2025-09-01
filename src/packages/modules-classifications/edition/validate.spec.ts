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
				additionalMaterial: '',
				legalMaterial: '',
				homepage: '',
			},
		});
	});
	it('should return an error for additionalMaterial, legalMaterial and homepage', function () {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
				additionalMaterial: 'notAnUrl',
				legalMaterial: 'notAnUrlEither',
				homepage: 'definetelyNotAnUrl',
			}),
		).toEqual({
			errorMessage: ['Invalid URL', 'Invalid URL', 'Invalid URL'],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
				additionalMaterial: 'Invalid URL',
				legalMaterial: 'Invalid URL',
				homepage: 'Invalid URL',
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
				additionalMaterial: '',
				legalMaterial: '',
				homepage: '',
			},
		});
	});
});
