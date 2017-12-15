import objectFromKeys from './object-from-keys';

describe('object from keys', () => {
	it('creates an object and assign the default value to each property', () => {
		const newObject = objectFromKeys(['firstName', 'lastName'], 'not provided');
		expect(newObject).toEqual({
			firstName: 'not provided',
			lastName: 'not provided',
		});
	});
});
