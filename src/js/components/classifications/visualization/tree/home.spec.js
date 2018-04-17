import React from 'react';
import { shallow } from 'enzyme';
import ClassificationTree from './home';

describe('classification-tree-home', () => {
	it('renders without crashing', () => {
		shallow(
			<ClassificationTree
				flatTree={[]}
				prefLabel={'prefLabel'}
				secondLang={true}
				saveSecondLang={() => console.log('save')}
			/>
		);
	});
});
