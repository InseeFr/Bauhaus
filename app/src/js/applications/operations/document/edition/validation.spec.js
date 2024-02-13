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
				labelLg2: 'The property <strong>Title</strong> is required.'
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
			errorMessage: ['The link is not valid'],
			fields: {
				url: 'The link is not valid',
			},
		});
	});
	it('should return an error for lang', function () {
		expect(
			validate({
				labelLg1: 'labelLg1',
				labelLg2: 'labelLg2',
				lang: '',
				updatedDate: 'd',
			},
            'document',
            [{name: 'path/correct-file_name.123'}],
            )
		).toEqual({
			errorMessage: [
				'The language is required',
			],
			fields: {
				lang: 'The language is required',
			},
		});
	});
	it('should return an error for updateDate', function () {
		expect(
			validate({
				labelLg1: 'labelLg1',
				labelLg2: 'labelLg2',
				lang: 'l',
			},
            'document',
            [{name: 'path/correct-file_name.123'}],
            )
		).toEqual({
			errorMessage: [
				'The update date is required',
			],
			fields: {
				updatedDate: 'The update date is required',
			},
		});
	});
	it('should return an error for file', function () {
		expect(
			validate({
				labelLg1: 'labelLg1',
				labelLg2: 'labelLg2',
				lang: 'l',
				updatedDate: 'd',
			},
            'document',
            [{name: 'path/wrong&file@name!'}],
            )
		).toEqual({
			errorMessage: [
				'The file name is incorrect. It can comprise alphanumeric (except accented characters), dash and underscore symbols',
			],
			fields: {
				file: 'The file name is incorrect. It can comprise alphanumeric (except accented characters), dash and underscore symbols',
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
			fields: {},
		});
	});
    it('should return no error either', function () {
		expect(
			validate({
				labelLg1: 'labelLg2',
				labelLg2: 'labelLg2',
				lang: 'l',
				updatedDate: 'd',
			},
            'document',
            [{name: 'path/correct-file_name.123'}],
            )
		).toEqual({
			errorMessage: [],
			fields: {},
		});
	});
});
