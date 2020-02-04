import React from 'react';
import { shallow } from 'enzyme';
import Table from './';

const rowParams = [{ dataField: 'total', text: 'Total', width: '100%' }];

const data = [
	{
		type: 'Sub-total',
		total: 10,
	},
	{
		type: 'Total',
		total: 100,
	},
];

describe('table', () => {
	it('renders without crashing', () => {
		shallow(<Table rowParams={rowParams} data={data} />);
	});
});
