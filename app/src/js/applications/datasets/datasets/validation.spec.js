import { validate } from './validation';

describe('validation', function () {
	it('should return an error for labelLg1', function () {
		expect(
			validate({
				labelLg2: 'labelLg2',
				catalogRecord: {
					creator: 'creator',
					contributor: 'contributor',
				},
				disseminationStatus: 'status',
				idSerie: 'id',
			})
		).toEqual({
			errorMessage: ['The property <strong>Intitulé</strong> is required.'],
			fields: {
				labelLg1: 'The property <strong>Intitulé</strong> is required.',
				labelLg2: '',
				altIdentifier: '',
				creator: '',
				contributor: '',
				disseminationStatus: '',
				idSerie: '',
			},
		});
	});
	it('should return an error for labelLg2', function () {
		expect(
			validate({
				labelLg1: 'labelLg1',
				catalogRecord: {
					creator: 'creator',
					contributor: 'contributor',
				},
				disseminationStatus: 'status',
				idSerie: 'id',
			})
		).toEqual({
			errorMessage: ['The property <strong>Title</strong> is required.'],
			fields: {
				labelLg1: '',
				labelLg2: 'The property <strong>Title</strong> is required.',
				altIdentifier: '',
				creator: '',
				contributor: '',
				disseminationStatus: '',
				idSerie: '',
			},
		});
	});
	it('should return an error for creator, contributor, disseminationStatus and idSerie', function () {
		expect(
			validate({
				labelLg1: 'labelLg2',
				labelLg2: 'labelLg2',
			})
		).toEqual({
			errorMessage: [
				'The property <strong>Propriétaire</strong> is required.',
				'The property <strong>Gestionnaire</strong> is required.',
				'The property <strong>Statut de diffusion</strong> is required.',
				'The property <strong>Produit de</strong> is required.',
			],
			fields: {
				labelLg1: '',
				labelLg2: '',
				altIdentifier: '',
				creator: 'The property <strong>Propriétaire</strong> is required.',
				contributor: 'The property <strong>Gestionnaire</strong> is required.',
				disseminationStatus:
					'The property <strong>Statut de diffusion</strong> is required.',
				idSerie: 'The property <strong>Produit de</strong> is required.',
			},
		});
	});
	it('should return no error', function () {
		expect(
			validate({
				labelLg1: 'labelLg2',
				labelLg2: 'labelLg2',
				catalogRecord: {
					creator: 'creator',
					contributor: 'contributor',
				},
				disseminationStatus: 'status',
				idSerie: 'id',
			})
		).toEqual({
			errorMessage: [],
			fields: {
				labelLg1: '',
				labelLg2: '',
				altIdentifier: '',
				creator: '',
				contributor: '',
				disseminationStatus: '',
				idSerie: '',
			},
		});
	});
});
