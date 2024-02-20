import { validate } from "./validation";

describe('validation', () => {
	it('should return an error if the identifiant is not defined ', () => {
		expect(validate({})).toEqual({
			fields: {
				'identifiant': 'The property <strong>Notation</strong> is required.',
				'labelLg1': 'The property <strong>Libellé</strong> is required.',
				'labelLg2': 'The property <strong>Label</strong> is required.',
				'type': 'The property <strong>Type</strong> is required.',
			},
			errorMessage: [
				'The property <strong>Notation</strong> is required.',
				'The property <strong>Libellé</strong> is required.',
				'The property <strong>Label</strong> is required.',
				'The property <strong>Type</strong> is required.',
			],
		});
	});

	it('should return an error if the labelLg1 is not defined ', () => {
		expect(validate({ identifiant: '1' })).toEqual({
			fields: {
				'labelLg1': 'The property <strong>Libellé</strong> is required.',
				'labelLg2': 'The property <strong>Label</strong> is required.',
				'type': 'The property <strong>Type</strong> is required.',
			},
			'errorMessage': [
				'The property <strong>Libellé</strong> is required.',
				'The property <strong>Label</strong> is required.',
				'The property <strong>Type</strong> is required.',
			],
		});
	});
});