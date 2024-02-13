import { validate } from './validation';

describe('validation', function() {
	it('should return an error for prefLabelLg1', function() {
		expect(
			validate({
				prefLabelLg1: '',
				prefLabelLg2: 'prefLabelLg2',
				creators: ['creator'],
				family: {id: 'i'},
			})
		).toEqual({
			errorMessage: [
				'The property <strong>Intitulé</strong> is required.',
			],
			fields: {
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
				prefLabelLg2: '',
				creators: '',
				family: '',
			},
		});
	});
	it('should return an error for prefLabelLg2', function() {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg1',
				prefLabelLg2: '',
				creators: ['creator'],
				family: {id: 'i'},
			})
		).toEqual({
			errorMessage: [
				'The property <strong>Title</strong> is required.',
			],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: 'The property <strong>Title</strong> is required.',
				creators: '',
				family: '',
			},
		});
	});
	it('should return an error for prefLabelLg1, prefLabelLg2, family and creators', function() {
		expect(
			validate({
				prefLabelLg1: '',
				prefLabelLg2: '',
			})
		).toEqual({
			errorMessage: [
				'The property <strong>Intitulé</strong> is required.',
				'The property <strong>Title</strong> is required.',
				'The property <strong>Owner</strong> is required.',
				'The property <strong>Famille</strong> is required.',
			],
			fields: {
				prefLabelLg1: 'The property <strong>Intitulé</strong> is required.',
				prefLabelLg2: 'The property <strong>Title</strong> is required.',
				creators: 'The property <strong>Owner</strong> is required.',
				family: 'The property <strong>Famille</strong> is required.',
			},
		});
	});
	it('should return no error', function() {
		expect(
			validate({
				prefLabelLg1: 'prefLabelLg2',
				prefLabelLg2: 'prefLabelLg2',
				family: {id: 'i'},
				creators: ['creator'],
			})
		).toEqual({
			errorMessage: [],
			fields: {
				prefLabelLg1: '',
				prefLabelLg2: '',
				creators: '',
				family: '',
			},
		});
	});
});
