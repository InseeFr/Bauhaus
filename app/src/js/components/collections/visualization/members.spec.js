import React from 'react';
import { shallow } from 'enzyme';
import CollectionMembers from './members';

describe('collection-visualization-members', () => {
	it('renders without crashing', () => {
		shallow(
			<CollectionMembers
				members={[]}
				secondLang={true}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
