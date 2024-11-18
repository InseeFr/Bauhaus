import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { ExplanatoryNote } from './';

describe('explanatory-note', () => {
	it('renders without crashing', () => {
		render(<ExplanatoryNote title="title" text="text" />);
	});

	it('renders null component', () => {
		const { container } = render(<ExplanatoryNote title="title" />);
		const { container: container2 } = render(<div className="col-md-6" />);
		expect(container).toContainHTML(container2.innerHTML);
	});

	it('renders not null component', () => {
		const { container } = render(<ExplanatoryNote text="text" title="title" />);
		expect(container.innerHTML).not.toBeNull();
	});
});
