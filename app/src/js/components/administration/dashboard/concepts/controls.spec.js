import React from 'react';
import { shallow } from 'enzyme';
import ConceptDashboardControls from './controls';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';

describe('concept-visualization-controls', () => {
	it('renders without crashing', () => {
		shallow(<ConceptDashboardControls />);
	});
	it('should render the component', () => {
		const tree = renderer
			.create(
				<Router>
					<ConceptDashboardControls />
				</Router>
			)
			.toJSON();
		expect(tree).toMatchSnapshot();
	});
});
