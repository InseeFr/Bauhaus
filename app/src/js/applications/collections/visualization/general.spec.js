import React from 'react';
import { shallow } from 'enzyme';
import CollectionGeneralVisualization from './general';
import { empty } from 'js/utils/collections/general';

describe('collection-visualization-general', () => {
	it('renders without crashing', () => {
		shallow(
			<CollectionGeneralVisualization
				attr={empty()}
				secondLang={false}
				langs={{ lg1: 'fr', lg2: 'en' }}
			/>
		);
	});
});
