import React from 'react';
import { shallow } from 'enzyme';
import ItemNotesVisualization from './notes';

describe('classification-visualization-notes', () => {
	it('renders without crashing', () => {
		shallow(
			<ItemNotesVisualization
				notes={{}}
				langs={{ lg1: 'fr', lg2: 'en' }}
				secondLang={true}
			/>
		);
	});
});
