import React from 'react';
import { shallow } from 'enzyme';
import SearchConceptsByLabel from './search-concepts-by-label';

describe('concept-edition-creation-search-concepts-by-label', () => {
	it('renders without crashing', () => {
		shallow(
			<SearchConceptsByLabel
				searchLabel="label"
				hitEls={[<div>Element</div>]}
				handleSearch={() => console.log('save')}
			/>
		);
	});
});
