import React from 'react';
import { shallow } from 'enzyme';
import IndicatorsHome from './home';
import { PageTitle, SearchableList } from '@inseefr/wilco';

describe('IndicatorsHome', () => {
	it('should display the PageTitle component', () => {
		const general = shallow(<IndicatorsHome indicators={[]} permission={{}} />);
		expect(general.find(PageTitle).length).toBe(1);
	});
	it('should display the SearchableList component', () => {
		const general = shallow(<IndicatorsHome indicators={[]} permission={{}} />);
		expect(general.find(SearchableList).length).toBe(1);
	});
});
