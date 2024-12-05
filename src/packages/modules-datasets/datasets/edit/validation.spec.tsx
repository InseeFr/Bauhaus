import { validate } from './validation';

describe('validation', function () {
	it('should return an error for labelLg1', function () {
		expect(
			validate({
				labelLg2: 'labelLg2',
				catalogRecord: {
					creator: 'creator',
					contributor: ['contributor'],
				},
				disseminationStatus: 'status',
				wasGeneratedIRIs: ['id'],
			}),
		).toEqual({
			errorMessage: ['The property <strong>Intitulé</strong> is required.'],
			fields: {
				labelLg1: 'The property <strong>Intitulé</strong> is required.',
				labelLg2: '',
				altIdentifier: '',
				creator: '',
				contributor: '',
				disseminationStatus: '',
				wasGeneratedIRIs: '',
			},
		});
	});
	it('should return an error for labelLg2', function () {
		expect(
			validate({
				labelLg1: 'labelLg1',
				catalogRecord: {
					creator: 'creator',
					contributor: ['contributor'],
				},
				disseminationStatus: 'status',
				wasGeneratedIRIs: ['id'],
			}),
		).toEqual({
			errorMessage: ['The property <strong>Title</strong> is required.'],
			fields: {
				labelLg1: '',
				labelLg2: 'The property <strong>Title</strong> is required.',
				altIdentifier: '',
				creator: '',
				contributor: '',
				disseminationStatus: '',
				wasGeneratedIRIs: '',
			},
		});
	});
	it('should return an error for creator, contributor, disseminationStatus and wasGeneratedIRIs', function () {
		expect(
			validate({
				labelLg1: 'labelLg2',
				labelLg2: 'labelLg2',
				contributor: [],
			}),
		).toEqual({
			errorMessage: [
				'The property <strong>Owner</strong> is required.',
				'The property <strong>Contributors</strong> is required.',
				'The property <strong>Dissemination status</strong> is required.',
				'The property <strong>Produced from</strong> is required.',
			],
			fields: {
				labelLg1: '',
				labelLg2: '',
				altIdentifier: '',
				creator: 'The property <strong>Owner</strong> is required.',
				contributor: 'The property <strong>Contributors</strong> is required.',
				disseminationStatus:
					'The property <strong>Dissemination status</strong> is required.',
				wasGeneratedIRIs:
					'The property <strong>Produced from</strong> is required.',
			},
		});
	});
	it('should return an error if wasGeneratedIRIs is an empty array', function () {
		expect(
			validate({
				labelLg1: 'labelLg2',
				labelLg2: 'labelLg2',
				catalogRecord: {
					creator: 'creator',
					contributor: ['contributor'],
				},
				disseminationStatus: 'status',
				wasGeneratedIRIs: [],
			}),
		).toEqual({
			errorMessage: [
				'The property <strong>Produced from</strong> is required.',
			],
			fields: {
				labelLg1: '',
				labelLg2: '',
				altIdentifier: '',
				creator: '',
				contributor: '',
				disseminationStatus: '',
				wasGeneratedIRIs:
					'The property <strong>Produced from</strong> is required.',
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
					contributor: ['contributor'],
				},
				disseminationStatus: 'status',
				wasGeneratedIRIs: ['id'],
			}),
		).toEqual({
			errorMessage: [],
			fields: {
				labelLg1: '',
				labelLg2: '',
				altIdentifier: '',
				creator: '',
				contributor: '',
				disseminationStatus: '',
				wasGeneratedIRIs: '',
			},
		});
	});
});
