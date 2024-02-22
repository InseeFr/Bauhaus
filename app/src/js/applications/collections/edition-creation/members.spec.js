import React from 'react';
import { render } from '@testing-library/react';
import CollectionMembers from './members';
import { MemoryRouter } from 'react-router-dom';

describe('collection-edition-creation-members', () => {
	it('renders without crashing', () => {
		render(
			<CollectionMembers
				members={[]}
				conceptList={[]}
				handleChange={jest.fn()}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
