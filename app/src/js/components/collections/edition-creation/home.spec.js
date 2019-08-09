import React from 'react';
import { shallow } from 'enzyme';
import Collection from './home';
import { empty } from 'js/utils/collections/general';

describe('collection-edition-creation', () => {
	it('renders without crashing', () => {
		shallow(
			<Collection
				title=""
				general={empty()}
				members={[]}
				collectionList={[]}
				conceptList={[]}
				stampList={[]}
				save={() => console.log('save')}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
