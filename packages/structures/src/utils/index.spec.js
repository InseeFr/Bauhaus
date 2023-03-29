import { getAllAttachment, validateComponent } from '.';

describe('getAllAttachment', () => {
	it('should return all default attachments', () => {
		const attachments = getAllAttachment([]);
		expect(attachments).toEqual([
			{
				label: 'Observation',
				value: 'http://purl.org/linked-data/cube#Observation',
			},
			{
				label: 'DataSet',
				value: 'http://purl.org/linked-data/cube#DataSet',
			},
			{
				label: 'Slice',
				value: 'http://purl.org/linked-data/cube#Slice',
			},
		]);
	});

	it('should return all default attachments with all measures', () => {
		const attachments = getAllAttachment([
			{
				id: 1,
				labelLg1: 'labelLg1',
			},
		]);
		expect(attachments).toEqual([
			{
				label: 'Observation',
				value: 'http://purl.org/linked-data/cube#Observation',
			},
			{
				label: 'DataSet',
				value: 'http://purl.org/linked-data/cube#DataSet',
			},
			{
				label: 'Slice',
				value: 'http://purl.org/linked-data/cube#Slice',
			},
			{
				label: 'labelLg1',
				value: 1,
			},
		]);
	});
});
describe('validateComponent', () => {
	it('should return an error if the identifiant is not defined ', () => {
		expect(validateComponent({})).toEqual({
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
		expect(validateComponent({ identifiant: '1' })).toEqual({
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
