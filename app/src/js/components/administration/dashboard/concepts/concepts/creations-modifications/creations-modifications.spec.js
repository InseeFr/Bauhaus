import React from 'react';
import { shallow } from 'enzyme';
import ConceptsDashboardEdition from './';

describe('dashboard-concepts-edition', () => {
	it('renders without crashing', () => {
		shallow(<ConceptsDashboardEdition conceptsData={[]} />);
	});
});
