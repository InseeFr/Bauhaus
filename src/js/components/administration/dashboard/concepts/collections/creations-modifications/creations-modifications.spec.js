import React from 'react';
import { shallow } from 'enzyme';
import CollectionsDashboardEdition from './';

describe('dashboard-collections-edition', () => {
	it('renders without crashing', () => {
		shallow(<CollectionsDashboardEdition collectionsData={[]} />);
	});
});
