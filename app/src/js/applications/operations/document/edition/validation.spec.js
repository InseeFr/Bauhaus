import { validate } from './validation';

describe('validation', function () {
	it('should return an error for labelLg1 and labelLg2', function () {
		expect(
			validate({
				labelLg1: '',
				labelLg2: '',
				lang: 'l',
				url: 'http://u'
			},
            'link',
            )
		).toEqual({
			errorMessage: [
                'The property <strong>Intitulé</strong> is required.',
                'The property <strong>Title</strong> is required.',
            ],
			fields: {
				labelLg1: 'The property <strong>Intitulé</strong> is required.',
				labelLg2: 'The property <strong>Title</strong> is required.',
				lang: '',
				url: '',
			},
		});
	});
	it('should return an error for url', function () {
		expect(
			validate({
				labelLg1: 'labelLg1',
				labelLg2: 'labelLg2',
				lang: 'l',
				url: 'mailto:you'
			},
            'link',
            )
		).toEqual({
			errorMessage: ["L'URL n'est pas valide"],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
				lang: '',
				url: "L'URL n'est valide",
			},
		});
	});
	it('should return an error for lang', function () {
		expect(
			validate({
				labelLg1: 'labelLg1',
				labelLg2: 'labelLg2',
				lang: '',
				updateDate: 'd',
                fields: [{name: 'f/a-z0_9.'}],
			},
            'document'
            )
		).toEqual({
			errorMessage: [
				'La langue est obligatoire',
			],
			fields: {
				labelLg1: '',
				labelLg2: '',
				lang: 'La langue est obligatoire',
				updateDate: '',
                fields: '',
			},
		});
	});
	it('should return no error', function () {
		expect(
			validate({
				labelLg1: 'labelLg2',
				labelLg2: 'labelLg2',
				lang: 'l',
				url: 'http://u'
			},
            'link',
            )
		).toEqual({
			errorMessage: [],
			fields: {
				labelLg1: '',
				labelLg2: '',
				lang: '',
				url: '',
			},
		});
	});
    it('should return no error either', function () {
		expect(
			validate({
				labelLg1: 'labelLg2',
				labelLg2: 'labelLg2',
				lang: 'l',
				updateDate: 'd',
                fields: [{name: 'f/a-z0_9.'}],
			},
            'document',
            )
		).toEqual({
			errorMessage: [],
			fields: {
				labelLg1: '',
				labelLg2: '',
				lang: '',
				updateDate: '',
                fields: '',
			},
		});
	});
});
