import { validate } from './validation';

describe('validation', function () {
	it('message should say incomplete collection', function () {
		expect(
			validate(
				{
					id: 'id',
					prefLabelLg1: 'prefLabelLg1',
				},
				[],
				'id',
				'prefLabelLg1'
			)
		).toEqual('Complete required fields in order to save this collection');
	});
	it('message should say duplicated id', function () {
		expect(
			validate(
				{
					id: 'éXèmplê',
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
				},
				[{ id: 'exemple' }],
				'id',
				'prefLabelLg1'
			)
		).toEqual('This identifier already exists');
	});
	it('message should say duplicated label', function () {
		expect(
			validate(
				{
					id: 'id',
					prefLabelLg1: 'éXèmplê',
					creator: 'creator',
				},
				[{ label: 'exemple' }],
				'id',
				'prefLabelLg1'
			)
		).toEqual('This label already exists');
	});
	it('message should be empty', function () {
		expect(
			validate(
				{
					id: 'id',
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
				},
				[],
				'id',
				'prefLabelLg1'
			)
		).toEqual();
	});
});
