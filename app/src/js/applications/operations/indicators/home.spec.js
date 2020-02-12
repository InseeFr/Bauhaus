import React from 'react';
import { shallow } from 'enzyme';
import IndicatorsHome from './home';
import { PageTitle, SearchRmes } from '@inseefr/wilco';

describe('IndicatorsHome', () => {
	it('should display the PageTitle component', () => {
		const general = shallow(<IndicatorsHome indicators={[]} permission={{}} />);
		expect(general.find(PageTitle).length).toBe(1);
	});
	it('should display the SearchRmes component', () => {
		const general = shallow(<IndicatorsHome indicators={[]} permission={{}} />);
		expect(general.find(SearchRmes).length).toBe(1);
	});
});
