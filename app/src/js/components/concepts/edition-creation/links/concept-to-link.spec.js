import React from 'react';
import { shallow } from 'enzyme';
import ConceptToLink from './concept-to-link';

describe('concept-edition-creation-concept-to-link', () => {
	it('renders without crashing', () => {
		shallow(
			<ConceptToLink
				title="title"
				memberEls={[]}
				searchComponent={<div>Element</div>}
			/>
		);
	});
});
