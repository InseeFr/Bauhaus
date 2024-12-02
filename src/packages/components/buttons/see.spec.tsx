import { render, screen, fireEvent } from '@testing-library/react';

import { SeeButton } from './see';

describe('SeeButton', () => {
	it('renders the button with the correct attributes and icon', () => {
		render(<SeeButton onClick={vi.fn()} />);

		const button = screen.getByRole('button');

		expect(button).not.toBeNull();
		expect(button.classList.contains('btn')).toBeTruthy();
		expect(button.classList.contains('btn-default')).toBeTruthy();

		expect(button.getAttribute('aria-label')).toBe('See');
		expect(button.getAttribute('title')).toBe('See');
		expect(button.getAttribute('type')).toBe('button');

		const icon = button.querySelector('span')!;
		expect(icon.classList.contains('glyphicon')).toBeTruthy();
		expect(icon.classList.contains('glyphicon-eye-open')).toBeTruthy();
	});

	it('calls the onClick handler when clicked', () => {
		const handleClick = vi.fn();
		render(<SeeButton onClick={handleClick} />);

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('passes additional props to the button element', () => {
		render(<SeeButton onClick={vi.fn()} data-test="see-button" />);

		const button = screen.getByRole('button');

		expect(button.dataset.test).toEqual('see-button');
	});
});
