import { render } from '@testing-library/react';
import CollectionsDashboardEdition from './';
import { MemoryRouter } from 'react-router-dom';

describe('dashboard-collections-edition', () => {
	it('renders without crashing', () => {
		render(
			<CollectionsDashboardEdition collectionsData={[]} type="creations" />,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
