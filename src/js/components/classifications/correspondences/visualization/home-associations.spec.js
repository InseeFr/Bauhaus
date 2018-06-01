import React from 'react';
import { shallow } from 'enzyme';
import HomeAssociations from './home-associations';

const associations = [
	{
		id: 'A-A',
		sourceLabelLg1: 'Source label',
		sourceId: 'A',
		targetLabelLg1: 'Target label',
		targetId: 'A',
	},
];

describe('correspondence-home-associations', () => {
	it('renders without crashing', () => {
		shallow(<HomeAssociations associations={associations} />);
	});
});
