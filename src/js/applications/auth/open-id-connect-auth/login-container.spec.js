import { mapStateToProps } from './login-container';

describe('mapStateToProps', () => {
	it('should return the stamp', () => {
		const input = {
			app: {
				auth: {
					user: {
						stamp: 'stamp',
					},
				},
			},
		};
		const output = {
			authenticated: 'stamp',
		};
		expect(mapStateToProps(input)).toEqual(output);
	});
});
