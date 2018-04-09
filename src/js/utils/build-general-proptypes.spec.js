import * as b from './build-general-proptypes';

const fieldsWithRequired = [
	['prefLabelLg1', true],
	['prefLabelLg2', false],
	['contributor', true],
];

describe('build-general-proptypes-utils', () => {
	describe('buildFields', () => {
		it('should return fields', () => {
			expect(b.buildFields(fieldsWithRequired)).toEqual([
				'prefLabelLg1',
				'prefLabelLg2',
				'contributor',
			]);
		});
	});
	describe('buildEmpty', () => {
		it('should return same string', () => {
			expect(b.buildEmpty(fieldsWithRequired)).toEqual({
				prefLabelLg1: '',
				prefLabelLg2: '',
				contributor: '',
			});
		});
	});
	describe('buildEmptyWithContributor', () => {
		it('should return same string', () => {
			expect(
				b.buildEmptyWithContributor(fieldsWithRequired, 'contributor')
			).toEqual({
				prefLabelLg1: '',
				prefLabelLg2: '',
				contributor: 'contributor',
			});
		});
	});
});
