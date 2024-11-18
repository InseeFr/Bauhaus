import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { D1 } from '../../../deprecated-locales';
import { Distribution } from '../../../model/Dataset';
import { ByteSizeInput } from './byte-size-input';

describe('ByteSizeInput', () => {
	const mockDistribution = { byteSize: '1024', id: '1' } as Distribution;
	const mockOnChange = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render the label and input with correct initial value', () => {
		render(<ByteSizeInput value={mockDistribution} onChange={mockOnChange} />);

		expect(screen.getByLabelText(D1.tailleTitle)).not.toBeNull();
		expect(screen.getByDisplayValue(mockDistribution.byteSize)).not.toBeNull();
	});

	it('should call onChange with updated byteSize when input changes', () => {
		render(<ByteSizeInput value={mockDistribution} onChange={mockOnChange} />);

		const input = screen.getByLabelText(D1.tailleTitle);
		fireEvent.change(input, { target: { value: '2048' } });

		expect(mockOnChange).toHaveBeenCalledWith({
			...mockDistribution,
			byteSize: '2048',
		});
	});

	it('should update input value when value prop changes', () => {
		const { rerender } = render(
			<ByteSizeInput value={mockDistribution} onChange={mockOnChange} />,
		);

		expect(screen.getByDisplayValue('1024')).not.toBeNull();

		const updatedDistribution = { ...mockDistribution, byteSize: '4096' };
		rerender(
			<ByteSizeInput value={updatedDistribution} onChange={mockOnChange} />,
		);

		expect(screen.getByDisplayValue('4096')).not.toBeNull();
	});
});
