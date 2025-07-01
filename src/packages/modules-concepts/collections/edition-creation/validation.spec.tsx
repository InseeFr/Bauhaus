import { validate } from './validation';

describe('validation', function () {
	it('should return an error for creator', function () {
		expect(
			validate(
				{
					id: 'id',
					prefLabelLg1: 'prefLabelLg1',
					creator: '',
				},
				[],
				'id',
				'prefLabelLg1',
			),
		).toEqual({
			errorMessage: ['The property <strong>Owner</strong> is required.'],
			fields: {
				prefLabelLg1: '',
				creator: 'The property <strong>Owner</strong> is required.',
			},
		});
	});

	it('should return an error if prefLabelLg1 already exists', function () {
		expect(
			validate(
				{
					id: 'id',
					prefLabelLg1: 'éXèmplê',
					creator: 'creator',
				},
				[{ id: 'other', label: 'exemple' }],
				'id',
				'prefLabelLg1',
			),
		).toEqual({
			errorMessage: ['This label already exists'],
			fields: {
				prefLabelLg1: 'This label already exists',
				creator: '',
			},
		});
	});

	it('should return no error', function () {
		expect(
			validate(
				{
					id: 'id',
					prefLabelLg1: 'prefLabelLg1',
					creator: 'creator',
				},
				[],
				'id',
				'prefLabelLg1',
			),
		).toEqual({
			errorMessage: [],
			fields: {
				prefLabelLg1: '',
				creator: '',
			},
		});
	});
});
