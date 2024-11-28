import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import SearchConceptsByLabel from './search-concepts-by-label';

vi.mock('../../../deprecated-locales', () => ({
	default: {
		searchLabelPlaceholder: 'Search by label',
	},
}));
vi.mock('@components/form/input', () => ({
	TextInput: ({
		value,
		onChange,
		placeholder,
	}: {
		value: string;
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
		placeholder: string;
	}) => (
		<input
			type="text"
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			data-testid="text-input"
		/>
	),
}));

vi.mock('@components/pagination', () => ({
	Pagination: ({ itemEls }: { itemEls: JSX.Element[] }) => (
		<div data-testid="pagination">{itemEls}</div>
	),
}));

describe('SearchConceptsByLabel Component', () => {
	it('renders the component with the correct props and behavior', () => {
		const searchLabel = 'Test Label';
		const handleSearch = vi.fn();
		const hitElements = [<div key="1">Hit 1</div>, <div key="2">Hit 2</div>];

		render(
			<SearchConceptsByLabel
				searchLabel={searchLabel}
				handleSearch={handleSearch}
				hitEls={hitElements}
			/>,
		);

		const textInput = screen.getByTestId('text-input') as HTMLInputElement;
		expect(textInput.value).toBe(searchLabel);
		expect(textInput.getAttribute('placeholder')).toBe('Search by label');

		fireEvent.change(textInput, { target: { value: 'New Label' } });
		expect(handleSearch).toHaveBeenCalledWith('New Label');

		screen.getByTestId('pagination');
		hitElements.forEach((hit) => {
			screen.getByText(hit.props.children);
		});
	});
});
