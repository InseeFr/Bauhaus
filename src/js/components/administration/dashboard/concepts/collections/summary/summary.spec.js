import React from 'react';
import { shallow } from 'enzyme';
import CollectionsSummary from './';

describe('dashboard-collections-summary', () => {
	it('renders without crashing', () => {
		shallow(<CollectionsSummary collectionsData={[]} />);
	});
});
