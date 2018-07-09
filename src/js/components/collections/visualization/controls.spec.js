import React from 'react';
import { shallow } from 'enzyme';
import CollectionVisualizationControls from './controls';

describe('collection-visualization-controls', () => {
	it('renders without crashing', () => {
		shallow(
			<CollectionVisualizationControls
				id="id"
				isValidated="false"
				handleValidation={() => console.log('validate')}
				permission={{ authType: '', roles: [''] }}
			/>
		);
	});
});
