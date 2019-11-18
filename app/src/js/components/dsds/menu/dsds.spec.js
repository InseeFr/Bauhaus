import React from 'react';
import { shallow } from 'enzyme';
import MenuDSDs from '.';
import { Link } from 'react-router-dom';

import MenuReferentiels from 'js/components/menu/referentiels';

describe('menu-dsds', () => {
	it('renders without crashing', () => {
		shallow(<MenuDSDs />);
	});
	it('should not display the MenuReferentiels', () => {
		const container = shallow(<MenuDSDs />);
		expect(container.find(MenuReferentiels).length).toBe(0);
	});
	it('should display the MenuReferentiels', () => {
		const preventDefault = jest.fn();
		const container = shallow(<MenuDSDs />);
		container
			.find(Link)
			.get(0)
			.props.onClick({ preventDefault: preventDefault });
		expect(container.find(MenuReferentiels).length).toBe(1);
		expect(preventDefault).toHaveBeenCalled();
	});
});
