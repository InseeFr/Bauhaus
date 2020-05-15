import { validateComponent } from '.';

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
