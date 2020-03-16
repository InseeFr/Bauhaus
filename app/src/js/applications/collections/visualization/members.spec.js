import React from 'react';
import { render } from '@testing-library/react';
import CollectionMembers from './members';

describe('collection-visualization-members', () => {
	it('renders without crashing', () => {
		render(
			<CollectionMembers
				members={[]}
				secondLang={true}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
