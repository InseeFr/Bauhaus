import { render, screen, fireEvent } from '@testing-library/react';
import { Mock, vi } from 'vitest';

import { useGoBack } from '@utils/hooks/useGoBack';

import { Menu } from './menu';

vi.mock('@utils/hooks/useGoBack', () => ({
	useGoBack: vi.fn(),
}));

describe('Menu Component', () => {
	it('renders CancelButton and SaveButton', () => {
		render(<Menu onSubmit={vi.fn()} onSubmitDisabled={false} />);

		expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
	});

	it('calls goBack with the correct path when CancelButton is clicked', () => {
		const goBackMock = vi.fn();
		(useGoBack as Mock).mockReturnValue(goBackMock);

		render(<Menu onSubmit={vi.fn()} onSubmitDisabled={false} />);

		const cancelButton = screen.getByRole('button', { name: /cancel/i });
		fireEvent.click(cancelButton);

		expect(goBackMock).toHaveBeenCalledWith('/datasets/distributions');
	});

	it('calls onSubmit when SaveButton is clicked', () => {
		const onSubmitMock = vi.fn();
		render(<Menu onSubmit={onSubmitMock} onSubmitDisabled={false} />);

		const saveButton = screen.getByRole('button', { name: /save/i });
		fireEvent.click(saveButton);

		expect(onSubmitMock).toHaveBeenCalledTimes(1);
	});

	it('disables the SaveButton when onSubmitDisabled is true', () => {
		render(<Menu onSubmit={vi.fn()} onSubmitDisabled={true} />);

		const saveButton = screen.getByRole('button', { name: /save/i });
		expect(saveButton).toBeDisabled();
	});
});
