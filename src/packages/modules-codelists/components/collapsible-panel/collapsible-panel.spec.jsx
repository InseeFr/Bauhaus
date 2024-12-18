import { render, fireEvent } from '@testing-library/react';

import { CollapsiblePanel } from '.';

describe('Collapsible Panel', () => {
	it('should not be collapsible', () => {
		const { container } = render(
			<CollapsiblePanel
				id="id"
				title="title"
				collapsible={false}
				children={<></>}
			/>,
		);
		expect(container.querySelector('#idbutton')).toBeNull();
	});
	it('should be expanded by default', () => {
		const { container } = render(
			<CollapsiblePanel
				id="id"
				title="title"
				hidden={false}
				children={<></>}
			/>,
		);
		expect(container.querySelector('#idbutton')).not.toBeNull();
		expect(container.querySelector('#idbody')).not.toHaveAttribute('hidden');
	});
	it('should be collapsed by default', () => {
		const { container } = render(
			<CollapsiblePanel id="id" title="title" hidden={true} children={<></>} />,
		);
		expect(container.querySelector('#idbutton')).not.toBeNull();
		expect(container.querySelector('#idbody')).toHaveAttribute('hidden');
	});
	it('should be expanded after clicking to the button', () => {
		const { container } = render(
			<CollapsiblePanel
				id="id"
				title="title"
				hidden={false}
				children={<></>}
			/>,
		);
		expect(container.querySelector('#idbody')).not.toHaveAttribute('hidden');

		fireEvent.click(container.querySelector('#idbutton'));

		expect(container.querySelector('#idbody')).toHaveAttribute('hidden');
	});
});
