import React from 'react';
import { shallow } from 'enzyme';
import MenuReferentiels from '.';
import { Link } from 'react-router-dom';

describe('menu-referenciels', () => {
	it('renders without crashing', () => {
		shallow(<MenuReferentiels />);
	});

	it('should display the home logo', () => {
		process.env.REACT_APP_APPLICATIONS = '';
		const component = shallow(<MenuReferentiels />);
		expect(component.find(Link).length).toBe(1);
	});

	it('should display two lists if the REACT_APP_APPLICATIONS contain one application', () => {
		process.env.REACT_APP_APPLICATIONS = 'operations';
		const component = shallow(<MenuReferentiels />);
		expect(component.find(Link).length).toBe(2);
	});

	it('should display three lists if the REACT_APP_APPLICATIONS contain two applications', () => {
		process.env.REACT_APP_APPLICATIONS = 'operations,concepts';
		const component = shallow(<MenuReferentiels />);
		expect(component.find(Link).length).toBe(3);
	});

	it('should display three lists if the REACT_APP_APPLICATIONS contain two applications, even if there is an extra space in environment variable', () => {
		process.env.REACT_APP_APPLICATIONS = 'operations, concepts';
		const component = shallow(<MenuReferentiels />);
		expect(component.find(Link).length).toBe(3);
	});
});
