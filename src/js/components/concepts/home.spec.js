import React from 'react';
import { shallow } from 'enzyme';
import Concepts from './home';

describe('concept', () => {
	it('renders without crashing', () => {
		shallow(<Concepts concepts={[]} permission={{ authType: '', role: '' }} />);
	});
});
