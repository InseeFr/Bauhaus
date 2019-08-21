import React from 'react';
import { shallow } from 'enzyme';
import CollectionMembers from './members';

describe('collection-edition-creation-members', () => {
	it('renders without crashing', () => {
		shallow(
			<CollectionMembers
				members={[]}
				conceptList={[]}
				handleChange={() => console.log('save')}
			/>
		);
	});
});
