import React from 'react';
import { shallow } from 'enzyme';
import Search from '.';

const items = Array.apply(null, Array(50)).map((a, i) => ({
	id: `${i + 1}`,
	label: `Item ${i + 1}`,
}));

describe('search', () => {
	it('renders without crashing', () => {
		shallow(<Search items={items} childPath="concept" />);
	});
});
