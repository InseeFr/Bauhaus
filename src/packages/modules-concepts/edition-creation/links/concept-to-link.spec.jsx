import { render } from '@testing-library/react';

import ConceptToLink from './concept-to-link';

describe('concept-edition-creation-concept-to-link', () => {
	it('renders without crashing', () => {
		render(
			<ConceptToLink
				title="title"
				memberEls={[]}
				searchComponent={<div>Element</div>}
			/>,
		);
	});
});
