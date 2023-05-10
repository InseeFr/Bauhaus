import { validate } from './validation';

describe('validation', function () {
	it('should return an error for prefLabelLg1', function () {
		expect(
			validate({
				prefLabelLg2: 'prefLabelLg2',
				family: 'family',
				creators: ['creator'],
				accrualPeriodicityCode: 'accrualPeriodicityCode',
				typeCode: 'typeCode',
			})
		).toEqual({
			errorMessage: ['The property <strong>Intitulé</strong> is required.'],
			fields: {
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
			},
		});
	});
	it('should return an error for prefLabelLg2', function () {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				family: 'family',
				creators: ['creator'],
				accrualPeriodicityCode: 'accrualPeriodicityCode',
				typeCode: 'typeCode',
			})
		).toEqual({
			errorMessage: ['The property <strong>Title</strong> is required.'],
			fields: {
				prefLabelLg2: 'The property <strong>Title</strong> is required.',
			},
		});
	});
	it('should return an error for prefLabelLg1 and prefLabelLg2', function () {
		expect(
			validate({
				accrualPeriodicityCode: 'accrualPeriodicityCode',
				typeCode: 'typeCode',
			})
		).toEqual({
			errorMessage: [
				'The property <strong>Propriétaire</strong> is required.',
				'The property <strong>Intitulé</strong> is required.',
				'The property <strong>Title</strong> is required.',
				'The property <strong>Famille</strong> is required.',
			],
			fields: {
				creators: 'The property <strong>Propriétaire</strong> is required.',
				family: 'The property <strong>Famille</strong> is required.',
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
				prefLabelLg2: 'The property <strong>Title</strong> is required.',
			},
		});
	});
	it('should return no errors', function () {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg2',
				prefLabelLg2: 'prefLabelLg2',
				family: 'family',
				creators: ['creator'],
				accrualPeriodicityCode: 'accrualPeriodicityCode',
				typeCode: 'typeCode',
			})
		).toEqual({
			errorMessage: [],
			fields: {},
		});
	});
});
