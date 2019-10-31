import React from 'react';
import { shallow } from 'enzyme';
import Flag from './';

describe('flag', () => {
	it('should return null if the flag is not defined', () => {
		const container = shallow(<Flag flag={null} />);
		expect(container.html()).toBe(null);
	});
	it('should return an image if the flag is defined', () => {
		const container = shallow(<Flag flag="fr" />);
		expect(container.find('img').props().src).toBe('fr');
		expect(container.find('img').props().alt).toBe('flag');
	});
});
