import { validate } from './validation';

describe('validation', function () {
	it('should return an error for labelLg1 and labelLg2', function () {
		expect(
			validate(
				{
					labelLg1: '',
					labelLg2: '',
					lang: 'l',
					url: 'http://u',
				},
				'link'
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
			validate(
				{
					labelLg1: 'labelLg1',
					labelLg2: 'labelLg2',
					lang: 'l',
					url: 'mailto:you',
				},
				'link'
			)
		).toEqual({
			errorMessage: ['The link is not valid'],
			fields: {
				labelLg1: '',
				labelLg2: '',
				lang: '',
				url: 'The link is not valid',
			},
		});
	});
	it('should return an error for lang', function () {
		expect(
			validate(
				{
					labelLg1: 'labelLg1',
					labelLg2: 'labelLg2',
					lang: '',
					updatedDate: 'd',
					files: [{ name: 'path/correct-file_name.123' }],
				},
				'document'
			)
		).toEqual({
			errorMessage: ['The language is required'],
			fields: {
				labelLg1: '',
				labelLg2: '',
				lang: 'The language is required',
				updatedDate: '',
				files: '',
			},
		});
	});
	it('should return an error for updateDate', function () {
		expect(
			validate(
				{
					labelLg1: 'labelLg1',
					labelLg2: 'labelLg2',
					lang: 'l',
					files: [{ name: 'path/correct-file_name.123' }],
				},
				'document'
			)
		).toEqual({
			errorMessage: ['The update date is required'],
			fields: {
				labelLg1: '',
				labelLg2: '',
				lang: '',
				updatedDate: 'The update date is required',
				files: '',
			},
		});
	});
	it('should return an error for file', function () {
		expect(
			validate(
				{
					labelLg1: 'labelLg1',
					labelLg2: 'labelLg2',
					lang: 'l',
					updatedDate: 'd',
					files: [{ name: 'path/wrong&file@name!.png' }],
				},
				'document'
			)
		).toEqual({
			errorMessage: [
				'The file name is incorrect. It can comprise alphanumeric (except accented characters), dash and underscore symbols',
			],
			fields: {
				labelLg1: '',
				labelLg2: '',
				lang: '',
				updatedDate: '',
				files:
					'The file name is incorrect. It can comprise alphanumeric (except accented characters), dash and underscore symbols',
			},
		});
	});
	it('should return no error', function () {
		expect(
			validate(
				{
					labelLg1: 'labelLg2',
					labelLg2: 'labelLg2',
					lang: 'l',
					url: 'http://u',
				},
				'link'
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
			validate(
				{
					labelLg1: 'labelLg2',
					labelLg2: 'labelLg2',
					lang: 'l',
					updatedDate: 'd',
					files: [{ name: 'correct-file_name.123' }],
				},
				'document'
			)
		).toEqual({
			errorMessage: [],
			fields: {
				labelLg1: '',
				labelLg2: '',
				lang: '',
				updatedDate: '',
				files: '',
			},
		});
	});
});
