import React from 'react';
import Controls from './controls';
import { shallow } from 'enzyme';
import { empty } from 'js/utils/collections/general';

describe('collection-edition-creation-controls', () => {
	it('renders without crashing', () => {
		shallow(
			<Controls
				general={empty()}
				collectionList={[]}
				handleSave={() => console.log('save')}
				redirectCancel={() => 'collections'}
			/>
		);
	});
});
