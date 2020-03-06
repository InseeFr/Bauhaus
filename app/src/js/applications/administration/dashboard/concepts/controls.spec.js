import React from 'react';
import { render } from '@testing-library/react';
import ConceptDashboardControls from './controls';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		render(
			<MemoryRouter>
				<ConceptDashboardControls />
			</MemoryRouter>
		);
	});
	it('should render the component', () => {
		const tree = renderer
			.create(
				<MemoryRouter>
					<ConceptDashboardControls />
				</MemoryRouter>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
