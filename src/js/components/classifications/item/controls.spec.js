import React from 'react';
import { shallow } from 'enzyme';
import Controls from './controls';

describe('classification-item-controls', () => {
	it('renders without crashing', () => {
		shallow(<Controls classificationId="nafr2" itemId="A" version={1} />);
	});
});
