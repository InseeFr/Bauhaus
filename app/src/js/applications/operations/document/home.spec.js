import React from 'react';
import { shallow } from 'enzyme';
import DocumentHome from './home';
import { PageTitle, SearchableList } from '@inseefr/wilco';

describe('DocumentHome', () => {
	it('should display the PageTitle component', () => {
		const general = shallow(<DocumentHome documents={[]} />);
		expect(general.find(PageTitle).length).toBe(1);
	});
	it('should display the SearchableList component', () => {
		const general = shallow(<DocumentHome documents={[]} />);
		expect(general.find(SearchableList).length).toBe(1);
	});
});
