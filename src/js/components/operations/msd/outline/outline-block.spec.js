import React from 'react';
import { shallow } from 'enzyme';
import OutlineBlock from 'js/components/operations/msd/outline/outline-block';
import { HashLink as Link } from 'react-router-hash-link';

jest.mock('js/components/operations/msd/utils');

const childrenClosed = {
	'2': { idMas: '2', children: [{}] },
};
const childrenOpened = {
	'1': { idMas: '1', children: [{}] },
};
describe('OutlineBlock', () => {
	it('should display the informations', () => {
		const general = shallow(
			<OutlineBlock parent="1" children={childrenOpened} />
		);
		const links = general.find(Link);
		expect(links.length).toBe(1);
		expect(links.first().props().to).toBe('/operations/help/1#1');
	});
	it('should not use anchor', () => {
		const general = shallow(
			<OutlineBlock disableSectionAnchor children={childrenOpened} />
		);
		const links = general.find(Link);
		expect(links.length).toBe(1);
		expect(links.first().props().to).toBe('/operations/help/#1');
	});
	it('should have 0 OutlineBlock if no child is opened', () => {
		const general = shallow(<OutlineBlock children={childrenClosed} />);
		expect(general.find(OutlineBlock).length).toBe(0);
	});
	it('should have a OutlineBlock if one child is opened', () => {
		const general = shallow(<OutlineBlock children={childrenOpened} />);
		expect(general.find(OutlineBlock).length).toBe(1);
	});
	it('should handle the click on the button', () => {
		const general = shallow(<OutlineBlock children={childrenClosed} />);
		expect(general.find(OutlineBlock).length).toBe(0);
		general.find('button').simulate('click');
		expect(general.find(OutlineBlock).length).toBe(1);
	});
	it('should have the right icon if opened', () => {
		const general = shallow(<OutlineBlock children={childrenClosed} />);
		expect(general.find('.glyphicon-chevron-down').length).toBe(1);
	});
	it('should have the right icon if not opened', () => {
		const general = shallow(<OutlineBlock children={childrenOpened} />);
		expect(general.find('.glyphicon-chevron-up').length).toBe(1);
	});
});
