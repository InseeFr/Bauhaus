import { fireEvent, render } from '@testing-library/react';

import ExportButton from '.';

describe('DropDown', () => {
	it('should be closed by default', () => {
		const { container } = render(<ExportButton actions={[]} />);
		expect(container.querySelector('.dropdown__content').classList).toContain(
			'inactive',
		);
	});
	it('should be opened after clicking on the trigger button', () => {
		const { container } = render(
			<ExportButton
				actions={[
					<button type="button" key={1}>
						Action 1
					</button>,
				]}
			/>,
		);
		fireEvent.click(container.querySelector('button'));
		expect(container.querySelector('.dropdown__content').classList).toContain(
			'active',
		);
	});
	it('should be closed when pressing the Escape key', () => {
		const { container } = render(<ExportButton actions={[]} />);
		fireEvent.click(container.querySelector('button'));
		fireEvent.keyDown(container.querySelector('.dropdown'), {
			key: 'Escape',
			code: 'Escape',
			keyCode: 27,
			charCode: 27,
		});
		expect(container.querySelector('.dropdown__content').classList).toContain(
			'inactive',
		);
	});
	it('should display the actions props', () => {
		const { container } = render(
			<ExportButton
				actions={[
					<button type="button" key={1}>
						Action 1
					</button>,
				]}
			/>,
		);
		expect(container.querySelector('li button').innerHTML).toContain(
			'Action 1',
		);
	});
});
