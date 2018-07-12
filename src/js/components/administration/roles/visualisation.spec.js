import React from 'react';
import { shallow } from 'enzyme';
import Visualisation from './visualisation';

const roles = [{ id: 'id', label: 'label', persons: [] }];

describe('administration-visualisation-roles', () => {
	it('renders without crashing', () => {
		shallow(<Visualisation roles={roles} />);
	});
});
