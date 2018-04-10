import React from 'react';
import { shallow } from 'enzyme';
import CollectionValidation from './home';

describe('collection-validation', () => {
	it('renders without crashing', () => {
		shallow(
			<CollectionValidation
				collections={[]}
				permission={{ authType: '', role: '' }}
				handleValidateCollectionList={() => console.log('validation')}
			/>
		);
	});
});
