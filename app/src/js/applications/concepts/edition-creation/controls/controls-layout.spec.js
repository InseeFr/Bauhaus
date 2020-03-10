import React from 'react';
import ControlsLayout from './controls-layout';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

describe('concept-edition-creation-controls-layout', () => {
	it('renders without crashing', () => {
		render(
			<ControlsLayout
				message="message"
				saveEnabled={false}
				conceptsWithLinks={[]}
				handleSave={() => console.log('validate')}
				redirectCancel={() => {}}
			/>,
			{ wrapper: MemoryRouter }
		);
	});
});
