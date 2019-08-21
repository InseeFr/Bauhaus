import React from 'react';
import ControlsLayout from './controls-layout';
import { shallow } from 'enzyme';

describe('concept-edition-creation-controls-layout', () => {
	it('renders without crashing', () => {
		shallow(
			<ControlsLayout
				message="message"
				saveEnabled={false}
				conceptsWithLinks={[]}
				handleSave={() => console.log('validate')}
			/>
		);
	});
});
