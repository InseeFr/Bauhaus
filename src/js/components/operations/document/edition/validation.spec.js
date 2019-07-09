import { validate } from './validation';
import { DOCUMENT } from '../utils';

describe('validate', () => {
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
		it('should return an error if ta name is not valid', () => {
			expect(validate(document, type, [{ name: 'name with space' }])).toEqual({
				errorMessage: 'The name of the file incorrect',
				fields: { file: true },
			});
		});
		it('should not return any error', () => {
			expect(
				validate(document, type, [{ name: 'name_without_space' }])
			).toEqual({
				errorMessage: '',
				fields: { file: false },
			});
		});
	});
});
