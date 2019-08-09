import React from 'react';
import { shallow } from 'enzyme';
import ConceptsSummary from './';

describe('dashboard-concepts-summary', () => {
	it('renders without crashing', () => {
		shallow(<ConceptsSummary conceptsData={[]} />);
	});
});
