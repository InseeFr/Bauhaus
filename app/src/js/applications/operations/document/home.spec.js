import React from 'react';
import { shallow } from 'enzyme';
import DocumentHome from './home';
import { PageTitle, SearchRmes } from '@inseefr/ui';

describe('DocumentHome', () => {
	it('should display the PageTitle component', () => {
		const general = shallow(<DocumentHome documents={[]} />);
		expect(general.find(PageTitle).length).toBe(1);
	});
	it('should display the SearchRmes component', () => {
		const general = shallow(<DocumentHome documents={[]} />);
		expect(general.find(SearchRmes).length).toBe(1);
	});
});
