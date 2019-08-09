import { goBack, goBackOrReplace } from './redirection';

const props = { history: { length: 1, push: jest.fn(), replace: jest.fn() } };

describe('redirection', () => {
	describe('goBack', () => {
		it('should return a function to push at default', () => {
			expect(goBack(props, 'default')).toEqual(expect.any(Function));
		});
	});
	describe('goBackOrReplace', () => {
		it('should call goBack if it is an update', () => {
			goBackOrReplace(props, 'default', false);
			expect(props.history.push).toHaveBeenCalled();
		});
		it('should call replace if it is an creation', () => {
			goBackOrReplace(props, 'default', true);
			expect(props.history.replace).toHaveBeenCalled();
		});
	});
});
