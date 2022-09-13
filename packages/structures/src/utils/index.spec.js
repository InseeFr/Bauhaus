import { validateComponent, getAllAttachment } from '.';

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
			field: 'identifiant',
			message: 'The id is mandatory',
		});
	});

	it('should return an error if the labelLg1 is not defined ', () => {
		expect(validateComponent({ identifiant: '1' })).toEqual({
			field: 'labelLg1',
			message: 'The label is mandatory',
		});
	});
});
