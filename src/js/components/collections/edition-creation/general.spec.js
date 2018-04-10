import React from 'react';
import { shallow } from 'enzyme';
import CollectionGeneral from './general';
import { empty } from 'js/utils/collections/general';

describe('collection-edition-creation-general', () => {
	it('renders without crashing', () => {
		shallow(
			<CollectionGeneral
				general={empty()}
				stampList={[]}
				handleChange={() => console.log('save')}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
