import { validate } from './validation';
import { DOCUMENT, LINK } from '../utils';

describe('validate', () => {
	[DOCUMENT, LINK].forEach(type => {
		it('should return an error if the labelLg1 is not defined', () => {
			expect(validate({}, type)).toEqual({
				errorMessage: 'The title is required',
				fields: { prefLabelLg1: true, prefLabelLg2: true },
			});
		});
		it('should return an error if the labelLg2 is not defined', () => {
			expect(validate({ labelLg1: 'prefLabelLg1' }, type)).toEqual({
				errorMessage: 'The title is required',
				fields: { prefLabelLg1: false, prefLabelLg2: true },
			});
		});
		it('should return an error if the lang is not defined', () => {
			expect(
				validate(
					{
						labelLg1: '1',
						labelLg2: '2',
						url: 'http://url.com',
					},
					type,
					[{ name: 'name_without_space' }]
				)
			).toEqual({
				errorMessage: 'The language is required',
				fields: { lang: true },
			});
		});
	});

	describe('link', () => {
		const type = LINK;
		const document = {
			labelLg1: '1',
			labelLg2: '2',
			lang: 'fr',
		};

		it('should return an error if the URL is not valid', () => {
			expect(
				validate(
					{
						...document,
						url: 'test',
					},
					type
				)
			).toEqual({
				errorMessage: 'The link is not valid',
				fields: { url: true },
			});
		});
		it('should not return errors', () => {
			expect(
				validate(
					{
						...document,
						url: 'http://test.com',
					},
					type
				)
			).toEqual({
				errorMessage: '',
				fields: {},
			});
		});
	});
	describe('documents', () => {
		const type = DOCUMENT;
		const document = {
			labelLg1: '1',
			labelLg2: '2',
			lang: 'fr',
		};
		it('should return an error if the files is undefined', () => {
			expect(validate(document, type)).toEqual({
				errorMessage: 'The file is required',
				fields: { file: true },
			});
		});
		it('should return an error if the files is an empty array', () => {
			expect(validate(document, type, [])).toEqual({
				errorMessage: 'The file is required',
				fields: { file: true },
			});
		});
		it('should return an error if the name is not valid', () => {
			expect(validate(document, type, [{ name: 'name with space' }])).toEqual({
				errorMessage:
					'The file name is incorrect. It can comprise alphanumeric (except accented characters), dash and underscore symbols',
				fields: { file: true },
			});
		});
		it('should not return any error', () => {
			expect(
				validate(document, type, [{ name: 'name_without_space' }])
			).toEqual({
				errorMessage: '',
				fields: {},
			});
		});
	});
});
