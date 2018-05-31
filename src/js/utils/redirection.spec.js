import { goBack } from './redirection';

const props = { history: { length: 1 } };

describe('redirection', () => {
	describe('goBack', () => {
		it('should return a function to push at default', () => {
			expect(goBack(props, 'default')).toEqual(expect.any(Function));
		});
	});
});
