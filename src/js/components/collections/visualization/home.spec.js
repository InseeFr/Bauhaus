import React from 'react';
import { shallow } from 'enzyme';
import CollectionVisualization from './home';
import { empty } from 'js/utils/collections/general';

describe('collection-visualization', () => {
	it('renders without crashing', () => {
		shallow(
			<CollectionVisualization
				id="id"
				general={empty()}
				members={[]}
				stampList={[]}
				validateCollection={() => console.log('validate')}
				secondLang={true}
				langs={{ lg1: 'fr', lg2: 'en' }}
				permission={{ authType: '', role: '' }}
			/>
		);
	});
});
