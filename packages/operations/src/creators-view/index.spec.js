import React from 'react';
import CreatorsView from './';
import { render } from '@testing-library/react';

describe('<CreatorsView />', () => {
	it('should return a list of item if the publishers is an object', () => {
		const publishers = 'id';
		const { container } = render(<CreatorsView creators={publishers} />);
		expect(container.querySelector('li').innerHTML).toBe('id');
	});
	it('should return a list of two items if the publishers is an array', () => {
		const publishers = ['id', 'id2'];
		const { container } = render(<CreatorsView creators={publishers} />);
		expect(container.querySelector('li:nth-child(1)').innerHTML).toBe('id');
		expect(container.querySelector('li:nth-child(2)').innerHTML).toBe('id2');
	});
});
