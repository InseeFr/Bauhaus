import React from 'react';
import { shallow } from 'enzyme';
import Placeholder from './placeholder';

describe('placeholder', () => {
	it('renders without crashing', () => {
		shallow(<Placeholder />);
	});

	it('returns component title (element)', () => {
		const wrapper = shallow(<Placeholder />);
		expect(wrapper.matchesElement(<div className="col-md-2" />)).toBeTruthy();
	});
});
