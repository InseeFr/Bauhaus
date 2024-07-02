import { render } from '@testing-library/react';
import ConceptLinks from './';
import { MemoryRouter } from 'react-router-dom';

describe('concept-edition-creation-links', () => {
	it('renders without crashing', () => {
		render(
			<ConceptLinks
				conceptsWithLinks={[]}
				handleChange={jest.fn()}
				handleChangeEquivalentLinks={jest.fn()}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
