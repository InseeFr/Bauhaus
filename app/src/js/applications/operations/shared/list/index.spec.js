import React from 'react';
import { shallow } from 'enzyme';
import OperationsObjectHome from './index';
import { PageTitle, SearchableList } from '@inseefr/wilco';

describe('FamiliesHome', () => {
	it('should display the PageTitle component', () => {
		const general = shallow(
			<OperationsObjectHome items={[]} createURL="" searchURL="" childPath="" />
		);
		expect(general.find(PageTitle).length).toBe(1);
	});
	it('should display the SearchableList component', () => {
		const general = shallow(
			<OperationsObjectHome items={[]} createURL="" searchURL="" childPath="" />
		);
		expect(general.find(SearchableList).length).toBe(1);
	});
});
