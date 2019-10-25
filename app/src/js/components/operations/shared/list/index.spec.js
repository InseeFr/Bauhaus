import React from 'react';
import { shallow } from 'enzyme';
import OperationsObjectHome from './index';
import { PageTitle } from 'bauhaus-library';
import { SearchRmes } from 'bauhaus-library';

describe('FamiliesHome', () => {
	it('should display the PageTitle component', () => {
		const general = shallow(
			<OperationsObjectHome items={[]} createURL="" searchURL="" childPath="" />
		);
		expect(general.find(PageTitle).length).toBe(1);
	});
	it('should display the SearchRmes component', () => {
		const general = shallow(
			<OperationsObjectHome items={[]} createURL="" searchURL="" childPath="" />
		);
		expect(general.find(SearchRmes).length).toBe(1);
	});
});
