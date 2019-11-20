import React from 'react';
import Controls from './controls';
import { shallow } from 'enzyme';

describe('collection-send-controls', () => {
	it('renders without crashing', () => {
		shallow(
			<Controls
				isRecipientValid={true}
				urlBack="collections"
				sendMessage={() => console.log('send')}
			/>
		);
	});
});
