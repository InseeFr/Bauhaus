import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { SearchableList } from './index';

const mockItems = [
	{ id: '1', label: 'First Item' },
	{ id: '2', label: 'Second Item' },
	{ id: '3', label: 'Third Item' },
];

describe('SearchableList', () => {
	it('renders items with string childPath', () => {
		render(
			<MemoryRouter>
				<SearchableList items={mockItems} childPath="items" />
			</MemoryRouter>,
		);

		const links = screen.getAllByRole('link');
		expect(links[0]).toHaveAttribute('href', '/items/1');
		expect(links[1]).toHaveAttribute('href', '/items/2');
		expect(links[2]).toHaveAttribute('href', '/items/3');
	});

	it('renders items with function childPath', () => {
		const childPathFn = (item: any) => `custom-${item.id}`;

		render(
			<MemoryRouter>
				<SearchableList items={mockItems} childPath={childPathFn} />
			</MemoryRouter>,
		);

		const links = screen.getAllByRole('link');
		expect(links[0]).toHaveAttribute('href', '/custom-1/1');
		expect(links[1]).toHaveAttribute('href', '/custom-2/2');
		expect(links[2]).toHaveAttribute('href', '/custom-3/3');
	});

	it('calls childPath function with correct item parameter', () => {
		const childPathFn = vi.fn((item: any) => `path-${item.id}`);

		render(
			<MemoryRouter>
				<SearchableList items={mockItems} childPath={childPathFn} />
			</MemoryRouter>,
		);

		expect(childPathFn).toHaveBeenCalledTimes(3);
		expect(childPathFn).toHaveBeenCalledWith(mockItems[0]);
		expect(childPathFn).toHaveBeenCalledWith(mockItems[1]);
		expect(childPathFn).toHaveBeenCalledWith(mockItems[2]);
	});

	it('uses custom label property', () => {
		const itemsWithCustomLabel = [
			{ id: '1', name: 'Custom Name 1' },
			{ id: '2', name: 'Custom Name 2' },
		];

		render(
			<MemoryRouter>
				<SearchableList
					items={itemsWithCustomLabel}
					childPath="items"
					label="name"
				/>
			</MemoryRouter>,
		);

		expect(screen.getByText('Custom Name 1')).toBeInTheDocument();
		expect(screen.getByText('Custom Name 2')).toBeInTheDocument();
	});

	it('applies itemFormatter function', () => {
		const itemFormatter = (content: string) => content.toUpperCase();

		render(
			<MemoryRouter>
				<SearchableList
					items={mockItems}
					childPath="items"
					itemFormatter={itemFormatter}
				/>
			</MemoryRouter>,
		);

		expect(screen.getByText('FIRST ITEM')).toBeInTheDocument();
		expect(screen.getByText('SECOND ITEM')).toBeInTheDocument();
		expect(screen.getByText('THIRD ITEM')).toBeInTheDocument();
	});

	it('renders search input with default placeholder', () => {
		render(
			<MemoryRouter>
				<SearchableList items={mockItems} childPath="items" />
			</MemoryRouter>,
		);

		const searchInput = screen.getByPlaceholderText('Label...');
		expect(searchInput).toBeInTheDocument();
	});

	it('renders search input with custom placeholder', () => {
		render(
			<MemoryRouter>
				<SearchableList
					items={mockItems}
					childPath="items"
					placeholder="Custom placeholder"
				/>
			</MemoryRouter>,
		);

		const searchInput = screen.getByPlaceholderText('Custom placeholder');
		expect(searchInput).toBeInTheDocument();
	});

	it('renders advanced search link when enabled', () => {
		render(
			<MemoryRouter>
				<SearchableList
					items={mockItems}
					childPath="items"
					advancedSearch={true}
					searchUrl="/advanced"
				/>
			</MemoryRouter>,
		);

		const advancedLink = screen.getByText('Advanced search');
		expect(advancedLink).toBeInTheDocument();
		expect(advancedLink.closest('a')).toHaveAttribute('href', '/advanced');
	});

	it('does not render advanced search link when disabled', () => {
		render(
			<MemoryRouter>
				<SearchableList items={mockItems} childPath="items" />
			</MemoryRouter>,
		);

		const advancedLink = screen.queryByText('Recherche avancée');
		expect(advancedLink).not.toBeInTheDocument();
	});

	it('displays result count', () => {
		render(
			<MemoryRouter>
				<SearchableList items={mockItems} childPath="items" />
			</MemoryRouter>,
		);

		const resultCount = screen.getByText(/3 (résultats|results)/);
		expect(resultCount).toBeInTheDocument();
	});
});
