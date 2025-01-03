import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import FilterToggleButtons from '.';
import { BOTH, DOCUMENT, LINK } from '../../modules-operations/document/utils';

describe('FilterToggleButtons Component', () => {
	const mockHandleSelection = vi.fn();

	const setup = (currentValue: string) => {
		const options = [
			[BOTH, 'Both'],
			[DOCUMENT, 'Document'],
			[LINK, 'Link'],
		] as [typeof BOTH | typeof DOCUMENT | typeof LINK, string][];

		render(
			<FilterToggleButtons
				options={options}
				currentValue={currentValue}
				handleSelection={mockHandleSelection}
			/>,
		);
	};

	afterEach(() => {
		vi.restoreAllMocks();
		mockHandleSelection.mockClear();
	});

	it('should render the correct number of buttons', () => {
		setup(BOTH);
		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(3);
	});

	it('should apply the active class to the selected button', () => {
		setup(DOCUMENT);
		const activeButton = screen.getByText('Document');
		expect(activeButton).toHaveClass(
			'bauhaus-filter-toggle-buttons-btn-active',
		);
	});

	it('should not apply the active class to unselected buttons', () => {
		setup(DOCUMENT);
		const unselectedButton = screen.getByText('Both');
		expect(unselectedButton).not.toHaveClass(
			'bauhaus-filter-toggle-buttons-btn-active',
		);
	});

	it('should call handleSelection with the correct value when a button is clicked', () => {
		setup(BOTH);
		const button = screen.getByText('Link');
		fireEvent.click(button);
		expect(mockHandleSelection).toHaveBeenCalledWith(LINK);
	});

	it('should render button labels correctly', () => {
		setup(BOTH);
		expect(screen.getByText('Both')).toBeDefined();
		expect(screen.getByText('Document')).toBeDefined();
		expect(screen.getByText('Link')).toBeDefined();
	});

	it('should handle empty options gracefully', () => {
		render(
			<FilterToggleButtons
				options={[]}
				currentValue={BOTH}
				handleSelection={mockHandleSelection}
			/>,
		);
		const buttons = screen.queryAllByRole('button');
		expect(buttons).toHaveLength(0);
	});
});
