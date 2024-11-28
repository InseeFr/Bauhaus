import { fireEvent, render, screen } from '@testing-library/react';

import { AdvancedSearchControls } from './controls';

describe('concepts-advanced-search-controls', () => {
	const mockOnClickReturn = vi.fn();
	const mockInitializeState = vi.fn();

	beforeEach(() => {
		render(
			<AdvancedSearchControls
				onClickReturn={mockOnClickReturn}
				initializeState={mockInitializeState}
			/>,
		);
	});

	it('should render ReturnButton and ResetButton', () => {
		screen.getByRole('button', { name: /back/i });
		screen.getByRole('button', { name: /reinitialize/i });
	});

	it('should call onClickReturn when ReturnButton is clicked', () => {
		fireEvent.click(screen.getByRole('button', { name: /back/i }));
		expect(mockOnClickReturn).toHaveBeenCalled();
	});

	it('should call initializeState when ResetButton is clicked', () => {
		fireEvent.click(screen.getByRole('button', { name: /reinitialize/i }));
		expect(mockInitializeState).toHaveBeenCalled();
	});
});
