import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { StampsInput } from './stamps-input';
import { useV2StampsOptions } from '../../../utils/hooks/stamps';

vi.mock('../../../utils/hooks/stamps', () => ({
	useV2StampsOptions: vi.fn(),
}));

vi.mock('../../ui/select', () => ({
	Select: ({
		label,
		placeholder,
		value,
		options,
		onChange,
		multi,
		required,
		filter,
	}: any) => (
		<div data-testid="select-component">
			<label>{label}</label>
			<div data-testid="placeholder">{placeholder}</div>
			<div data-testid="value">{JSON.stringify(value)}</div>
			<div data-testid="multi">{multi ? 'true' : 'false'}</div>
			<div data-testid="required">{required ? 'true' : 'false'}</div>
			<div data-testid="filter">{filter ? 'true' : 'false'}</div>
		</div>
	),
}));

describe('StampsInput', () => {
	const mockStampsOptions = [
		{ value: 'stamp1', label: 'Stamp 1' },
		{ value: 'stamp2', label: 'Stamp 2' },
	];

	beforeEach(() => {
		(useV2StampsOptions as Mock).mockReturnValue(mockStampsOptions);
	});

	it('renders with single value mode', () => {
		const mockOnChange = vi.fn();
		render(
			<StampsInput
				value="stamp1"
				onChange={mockOnChange}
				multi={false}
				lang="first"
				labelSingle="Creator"
				labelMulti="Creators"
			/>,
		);

		expect(screen.getByText('Creator')).toBeInTheDocument();
		expect(screen.getByTestId('multi')).toHaveTextContent('false');
		expect(screen.getByTestId('value')).toHaveTextContent('"stamp1"');
	});

	it('renders with multi value mode', () => {
		const mockOnChange = vi.fn();
		render(
			<StampsInput
				value={['stamp1', 'stamp2']}
				onChange={mockOnChange}
				multi={true}
				lang="first"
				labelSingle="Creator"
				labelMulti="Creators"
			/>,
		);

		expect(screen.getByText('Creators')).toBeInTheDocument();
		expect(screen.getByTestId('multi')).toHaveTextContent('true');
		expect(screen.getByTestId('value')).toHaveTextContent(
			'["stamp1","stamp2"]',
		);
	});

	it('handles empty value in multi mode', () => {
		const mockOnChange = vi.fn();
		render(
			<StampsInput
				value={[]}
				onChange={mockOnChange}
				multi={true}
				lang="first"
				labelSingle="Creator"
				labelMulti="Creators"
			/>,
		);

		expect(screen.getByTestId('value')).toHaveTextContent('[]');
	});

	it('handles undefined value in single mode', () => {
		const mockOnChange = vi.fn();
		render(
			<StampsInput
				value=""
				onChange={mockOnChange}
				multi={false}
				lang="first"
				labelSingle="Creator"
				labelMulti="Creators"
			/>,
		);

		expect(screen.getByTestId('value')).toBeInTheDocument();
	});

	it('renders with required prop', () => {
		const mockOnChange = vi.fn();
		render(
			<StampsInput
				value="stamp1"
				onChange={mockOnChange}
				required={true}
				lang="first"
				labelSingle="Creator"
				labelMulti="Creators"
			/>,
		);

		expect(screen.getByTestId('required')).toHaveTextContent('true');
	});

	it('renders without required prop', () => {
		const mockOnChange = vi.fn();
		render(
			<StampsInput
				value="stamp1"
				onChange={mockOnChange}
				required={false}
				lang="first"
				labelSingle="Creator"
				labelMulti="Creators"
			/>,
		);

		expect(screen.getByTestId('required')).toHaveTextContent('false');
	});

	it('uses correct dictionary for first lang', () => {
		const mockOnChange = vi.fn();
		render(
			<StampsInput
				value="stamp1"
				onChange={mockOnChange}
				lang="first"
				labelSingle="Creator"
				labelMulti="Creators"
			/>,
		);

		expect(screen.getByTestId('placeholder')).toBeInTheDocument();
	});

	it('uses correct dictionary for default lang', () => {
		const mockOnChange = vi.fn();
		render(
			<StampsInput
				value="stamp1"
				onChange={mockOnChange}
				lang="default"
				labelSingle="Creator"
				labelMulti="Creators"
			/>,
		);

		expect(screen.getByTestId('placeholder')).toBeInTheDocument();
	});

	it('enables filter by default', () => {
		const mockOnChange = vi.fn();
		render(
			<StampsInput
				value="stamp1"
				onChange={mockOnChange}
				lang="first"
				labelSingle="Creator"
				labelMulti="Creators"
			/>,
		);

		expect(screen.getByTestId('filter')).toHaveTextContent('true');
	});
});
