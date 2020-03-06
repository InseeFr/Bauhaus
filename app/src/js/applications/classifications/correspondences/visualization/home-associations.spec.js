import React from 'react';
import { render } from '@testing-library/react';
import HomeAssociations from './home-associations';
import { MemoryRouter } from 'react-router-dom';

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
		render(
			<HomeAssociations associations={associations} correspondence={{}} />,
			{
				wrapper: MemoryRouter,
			}
		);
	});
});
