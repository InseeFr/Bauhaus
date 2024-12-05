import { validate } from './validation';

describe('validation', function () {
	it('should return an error for prefLabelLg1', function () {
		expect(
			validate({
				prefLabelLg1: '',
				prefLabelLg2: 'prefLabelLg2',
				creators: ['creator'],
				family: { id: 'i' },
				accrualPeriodicityCode: 'accrualPeriodicityCode',
				typeCode: 'typeCode',
			}),
		).toEqual({
			errorMessage: ['The property <strong>Intitulé</strong> is required.'],
			fields: {
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
				prefLabelLg2: '',
				creators: '',
				family: '',
				accrualPeriodicityCode: '',
				typeCode: '',
			},
		});
	});
	it('should return an error for prefLabelLg2', function () {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: '',
				creators: ['creator'],
				family: { id: 'i' },
				accrualPeriodicityCode: 'accrualPeriodicityCode',
				typeCode: 'typeCode',
			}),
		).toEqual({
			errorMessage: ['The property <strong>Title</strong> is required.'],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: 'The property <strong>Title</strong> is required.',
				creators: '',
				family: '',
				accrualPeriodicityCode: '',
				typeCode: '',
			},
		});
	});
	it('should return an error for prefLabelLg1, prefLabelLg2, family and creators', function () {
		expect(
			validate({
				prefLabelLg1: '',
				prefLabelLg2: '',
				accrualPeriodicityCode: 'accrualPeriodicityCode',
				typeCode: 'typeCode',
			}),
		).toEqual({
			errorMessage: [
				'The property <strong>Family</strong> is required.',
				'The property <strong>Intitulé</strong> is required.',
				'The property <strong>Title</strong> is required.',
				'The property <strong>Owners</strong> is required.',
			],
			fields: {
				family: 'The property <strong>Family</strong> is required.',
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
				prefLabelLg2: 'The property <strong>Title</strong> is required.',
				creators: 'The property <strong>Owners</strong> is required.',
				accrualPeriodicityCode: '',
				typeCode: '',
			},
		});
	});
	it('should return no error', function () {
		expect(
			validate({
				family: { id: 'i' },
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: 'prefLabelLg2',
				creators: ['creator'],
				accrualPeriodicityCode: 'accrualPeriodicityCode',
				typeCode: 'typeCode',
			}),
		).toEqual({
			errorMessage: [],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
				creators: '',
				family: '',
				accrualPeriodicityCode: '',
				typeCode: '',
			},
		});
	});
});
