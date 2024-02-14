import { validate } from './validation';

describe('validation', function() {
	it('should return an error for labelLg1', function() {
		expect(
			validate({
				labelLg2: 'labelLg2',
                idDataset: 'id',
			})
		).toEqual({
			errorMessage: [
				'The property <strong>Intitulé</strong> is required.',
			],
			fields: {
				labelLg1: 'The property <strong>Intitulé</strong> is required.',
				labelLg2: '',
                idDataset: '',
			},
		});
	});
	it('should return an error for labelLg2', function() {
		expect(
			validate({
				labelLg1: 'labelLg1',
				idDataset: 'id',
			})
		).toEqual({
			errorMessage: [
				'The property <strong>Title</strong> is required.',
			],
			fields: {
				labelLg1: '',
				labelLg2: 'The property <strong>Title</strong> is required.',
                idDataset: '',
			},
		});
	});
	it('should return an error for idDataset', function() {
		expect(
			validate({
				labelLg1: 'labelLg1',
				labelLg2: 'labelLg2',
			})
		).toEqual({
			errorMessage: [
				'The property <strong>Jeu de Données</strong> is required.',
			],
			fields: {
				labelLg1: '',
				labelLg2: '',
                idDataset: 'The property <strong>Jeu de Données</strong> is required.',
			},
		});
	});
	it('should return no error', function() {
		expect(
			validate({
                labelLg1: 'labelLg2',
                labelLg2: 'labelLg2',
                idDataset: 'id',
			})
		).toEqual({
			errorMessage: [],
			fields: {
				labelLg1: '',
				labelLg2: '',
                idDataset: '',
			},
		});
	});
});
