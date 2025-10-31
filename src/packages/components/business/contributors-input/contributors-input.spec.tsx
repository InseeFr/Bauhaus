import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContributorsInput } from './contributors-input';

vi.mock('../../i18n', () => ({
	default: {
		contributors: {
			title: 'Gestionnaires',
		},
	},
	D2: {
		contributors: {
			title: 'Contributors',
		},
	},
}));

vi.mock('../stamps-input/stamps-input', () => ({
	StampsInput: ({
		labelSingle,
		labelMulti,
		lang,
		value,
		onChange,
		...rest
	}: any) => (
		<div data-testid="stamps-input">
			<label>{labelSingle}</label>
			<div data-testid="label-multi">{labelMulti}</div>
			<div data-testid="lang">{lang}</div>
			<div data-testid="value">{JSON.stringify(value)}</div>
		</div>
	),
}));

describe('ContributorsInput', () => {
	it('renders StampsInput with contributor labels for first lang', () => {
		const mockOnChange = vi.fn();
		render(
			<ContributorsInput
				value="contributor1"
				onChange={mockOnChange}
				lang="first"
				multi={false}
			/>,
		);

		const stampsInput = screen.getByTestId('stamps-input');
		expect(stampsInput).toBeInTheDocument();
		expect(screen.getByTestId('lang')).toHaveTextContent('first');
	});

	it('renders StampsInput with contributor labels for default lang', () => {
		const mockOnChange = vi.fn();
		render(
			<ContributorsInput
				value="contributor1"
				onChange={mockOnChange}
				lang="default"
				multi={false}
			/>,
		);

		const stampsInput = screen.getByTestId('stamps-input');
		expect(stampsInput).toBeInTheDocument();
		expect(screen.getByTestId('lang')).toHaveTextContent('default');
	});

	it('forwards all props to StampsInput', () => {
		const mockOnChange = vi.fn();
		render(
			<ContributorsInput
				value={['contributor1', 'contributor2']}
				onChange={mockOnChange}
				lang="first"
				multi={true}
				required={true}
			/>,
		);

		expect(screen.getByTestId('value')).toHaveTextContent(
			'["contributor1","contributor2"]',
		);
	});

	it('handles empty value', () => {
		const mockOnChange = vi.fn();
		render(
			<ContributorsInput
				value=""
				onChange={mockOnChange}
				lang="first"
				multi={false}
			/>,
		);

		expect(screen.getByTestId('stamps-input')).toBeInTheDocument();
	});

	it('uses same label for single and multi mode', () => {
		const mockOnChange = vi.fn();
		render(
			<ContributorsInput
				value={['contributor1']}
				onChange={mockOnChange}
				lang="first"
				multi={true}
			/>,
		);

		const labels = screen.getAllByText('Gestionnaires');
		expect(labels).toHaveLength(2);

		const labelMulti = screen.getByTestId('label-multi');
		expect(labelMulti.textContent).toBe('Gestionnaires');
	});
});
