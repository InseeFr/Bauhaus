import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { DatasetSelect } from './dataset-select';

vi.mock('../../../../../deprecated-locales', () => ({
	D1: {
		datasetTitle: 'Dataset',
	},
}));

const mockUseDatasetsForDistributions = vi.fn();

vi.mock('../../../../datasets', () => ({
	useDatasetsForDistributions: () => mockUseDatasetsForDistributions(),
}));

describe('DatasetSelect', () => {
	const mockDatasets = [
		{ id: '1', label: 'Dataset 1' },
		{ id: '2', label: 'Dataset 2' },
		{ id: '3', label: 'Dataset 3' },
	];

	beforeEach(() => {
		mockUseDatasetsForDistributions.mockReturnValue({
			data: mockDatasets,
		});
	});

	it('should render the component with label', () => {
		const mockOnChange = vi.fn();

		const { container } = render(
			<DatasetSelect disabled={false} value="" onChange={mockOnChange} />,
		);

		const label = container.querySelector('label[for="idDataset"]');
		expect(label?.textContent).toContain('Dataset');
	});

	it('should render Select with correct props', () => {
		const mockOnChange = vi.fn();

		const { container } = render(
			<DatasetSelect disabled={false} value="2" onChange={mockOnChange} />,
		);

		const selectElement = container.querySelector('.p-dropdown');
		expect(selectElement).not.toBeNull();
	});

	it('should be disabled when disabled prop is true', () => {
		const mockOnChange = vi.fn();

		const { container } = render(
			<DatasetSelect disabled={true} value="1" onChange={mockOnChange} />,
		);

		const selectElement = container.querySelector('.p-dropdown');
		expect(selectElement?.getAttribute('data-p-disabled')).toBe('true');
	});

	it('should not be disabled when disabled prop is false', () => {
		const mockOnChange = vi.fn();

		const { container } = render(
			<DatasetSelect disabled={false} value="1" onChange={mockOnChange} />,
		);

		const selectElement = container.querySelector('.p-dropdown');
		expect(selectElement?.getAttribute('data-p-disabled')).toBe('false');
	});

	it('should call onChange when value changes', () => {
		const mockOnChange = vi.fn();

		const { container } = render(
			<DatasetSelect disabled={false} value="1" onChange={mockOnChange} />,
		);

		const dropdownTrigger = container.querySelector('.p-dropdown-trigger');
		if (dropdownTrigger) {
			fireEvent.click(dropdownTrigger);
			const options = screen.getAllByText('Dataset 2');
			fireEvent.click(options[options.length - 1]);
		}

		expect(mockOnChange).toHaveBeenCalledWith('2');
	});

	it('should display error when error prop is provided', () => {
		const mockOnChange = vi.fn();
		const errorMessage = 'This field is required';

		render(
			<DatasetSelect
				disabled={false}
				value=""
				onChange={mockOnChange}
				error={errorMessage}
			/>,
		);

		expect(screen.getByText(errorMessage)).not.toBeNull();
	});

	it('should not display error when error prop is not provided', () => {
		const mockOnChange = vi.fn();

		render(<DatasetSelect disabled={false} value="1" onChange={mockOnChange} />);

		const errorElement = screen.queryByText(/error/i);
		expect(errorElement).toBeNull();
	});

	it('should render with empty datasets', () => {
		const mockOnChange = vi.fn();
		mockUseDatasetsForDistributions.mockReturnValue({
			data: undefined,
		});

		const { container } = render(
			<DatasetSelect disabled={false} value="" onChange={mockOnChange} />,
		);

		const label = container.querySelector('label[for="idDataset"]');
		expect(label?.textContent).toContain('Dataset');
	});

	it('should display correct value from datasets', () => {
		const mockOnChange = vi.fn();

		const { container } = render(
			<DatasetSelect disabled={false} value="2" onChange={mockOnChange} />,
		);

		const selectedValue = container.querySelector('.p-dropdown-label');
		expect(selectedValue?.textContent).toBe('Dataset 2');
	});
});
