import { validate } from './validation';

describe('validation', function () {
	it('should return an error for labelLg1', function () {
		expect(
			validate({
				idDataset: 'id',
				labelLg2: 'labelLg2',
			}),
		).toEqual({
			errorMessage: ['The property <strong>Intitulé</strong> is required.'],
			fields: {
				idDataset: '',
				labelLg1: 'The property <strong>Intitulé</strong> is required.',
				labelLg2: '',
			},
		});
	});
	it('should return an error for labelLg2', function () {
		expect(
			validate({
				idDataset: 'id',
				labelLg1: 'labelLg1',
			}),
		).toEqual({
			errorMessage: ['The property <strong>Title</strong> is required.'],
			fields: {
				idDataset: '',
				labelLg1: '',
				labelLg2: 'The property <strong>Title</strong> is required.',
			},
		});
	});
	it('should return an error for idDataset', function () {
		expect(
			validate({
				labelLg1: 'labelLg1',
				labelLg2: 'labelLg2',
			}),
		).toEqual({
			errorMessage: ['The property <strong>Dataset</strong> is required.'],
			fields: {
				idDataset: 'The property <strong>Dataset</strong> is required.',
				labelLg1: '',
				labelLg2: '',
			},
		});
	});
	it('should return no error', function () {
		expect(
			validate({
				idDataset: 'id',
				labelLg1: 'labelLg2',
				labelLg2: 'labelLg2',
			}),
		).toEqual({
			errorMessage: [],
			fields: {
				idDataset: '',
				labelLg1: '',
				labelLg2: '',
			},
		});
	});
});
