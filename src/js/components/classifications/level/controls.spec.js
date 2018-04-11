import React from 'react';
import { shallow } from 'enzyme';
import Controls from './controls';

describe('classification-level-controls', () => {
	it('renders without crashing', () => {
		shallow(<Controls id="nafr2" />);
	});
});
