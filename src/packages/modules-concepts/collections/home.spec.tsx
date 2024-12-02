import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { SearchableList } from '../../components';
import D from '../../deprecated-locales';
import { useTitle } from '../../utils/hooks/useTitle';
import CollectionsHome from './home';

vi.mock('../../utils/hooks/useTitle');
vi.mock('../../components', () => ({
	PageTitle: vi.fn(() => <div>PageTitle</div>),
	Row: vi.fn(({ children }) => <div>{children}</div>),
	SearchableList: vi.fn(() => <div>SearchableList</div>),
}));
vi.mock('./menu', () => ({
	Menu: vi.fn(() => <div>Menu</div>),
}));

describe('CollectionsHome', () => {
	const collectionsMock = [
		{ id: '1', label: 'Collection 1' },
		{ id: '2', label: 'Collection 2' },
	];

	it('should render the page title and the searchable list with correct data', () => {
		render(<CollectionsHome collections={collectionsMock} />);

		expect(useTitle).toHaveBeenCalledWith(D.conceptsTitle, D.collectionsTitle);

		screen.getByText('PageTitle');
		screen.getByText('SearchableList');
	});

	it('should render the Menu component', () => {
		render(<CollectionsHome collections={collectionsMock} />);
		screen.getByText('Menu');
	});

	it('should pass collections prop to SearchableList', () => {
		render(<CollectionsHome collections={collectionsMock} />);
		expect(SearchableList).toHaveBeenCalledWith(
			expect.objectContaining({
				items: collectionsMock,
				childPath: 'concepts/collections',
				autoFocus: true,
			}),
			{},
		);
	});
});
