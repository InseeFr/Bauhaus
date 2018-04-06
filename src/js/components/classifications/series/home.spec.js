import React from 'react';
import { shallow } from 'enzyme';
import Home from './home';

const series = [{ id: '1', label: 'Series 1' }];

describe('classification-series-home', () => {
	it('renders without crashing', () => {
		shallow(<Home series={series} />);
	});
});
