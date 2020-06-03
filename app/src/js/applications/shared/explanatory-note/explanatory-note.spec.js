import '@testing-library/jest-dom';
import React from 'react';
import { render } from '@testing-library/react';
import { ExplanatoryNote } from './';

describe('explanatory-note', () => {
	it('renders without crashing', () => {
		render(<ExplanatoryNote />);
	});

	it('renders null component', () => {
		const { container } = render(<ExplanatoryNote />);
		const { container: container2 } = render(<div className="col-md-6" />);
		expect(container).toContainHTML(container2.innerHTML);
	});

	it('renders not null component', () => {
		const { container } = render(<ExplanatoryNote text="text" />);
		expect(container.innerHTML).not.toBeNull();
	});
});
