import React from 'react';
import { shallow } from 'enzyme';
import Controls from './controls';

describe('concept-send-controls', () => {
	it('renders without crashing', () => {
		shallow(
			<Controls
				isRecipientValid={true}
				sendMessage={() => console.log('send')}
			/>
		);
	});
});
