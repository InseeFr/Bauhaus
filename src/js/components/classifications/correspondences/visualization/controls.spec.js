import React from 'react';
import { shallow } from 'enzyme';
import CorrespondenceControls from './controls';

describe('classification-correspondence-visualization-controls', () => {
	it('renders without crashing', () => {
		shallow(<CorrespondenceControls />);
	});
});
