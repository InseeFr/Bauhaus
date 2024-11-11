import CreatorsView from './';
import { render } from '@testing-library/react';

describe('<CreatorsView />', () => {
	it('should return a list of item if the creators is an object', () => {
		const creators = 'id';
		const { container } = render(<CreatorsView creators={creators} />);
		expect(container.querySelector('p')!.innerHTML).toBe('id');
	});
	it('should return a list of two items if the creators is an array', () => {
		const creators = ['id', 'id2'];
		const { container } = render(<CreatorsView creators={creators} />);
		expect(container.querySelector('li:nth-child(1)')!.innerHTML).toBe('id');
		expect(container.querySelector('li:nth-child(2)')!.innerHTML).toBe('id2');
	});
});
