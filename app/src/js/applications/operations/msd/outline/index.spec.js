import React from 'react';
import { shallow } from 'enzyme';
import Outline from './index';
import { HashLink as Link } from 'react-router-hash-link';
import OutlineBlock from 'js/applications/operations/msd/outline/outline-block';

jest.mock('js/applications/operations/msd/utils');

const metadataStructureOpened = {
	idMas: '1',
	masLabelLg1: 'masLabelLg1',
	children: [{}],
};

const metadataStructureClosed = {
	idMas: '2',
	masLabelLg1: 'masLabelLg1',
	children: [{}],
};

describe('Outline', () => {
	it('should display the information', () => {
		const general = shallow(
			<Outline metadataStructure={metadataStructureOpened} storeCollapseState />
		);
		const links = general.find(Link);
		expect(links.length).toBe(1);
		expect(links.first().props().to).toBe('/operations/help/1#1');
	});
	it('should displayed a collapsed block', () => {
		const general = shallow(
			<Outline metadataStructure={metadataStructureClosed} storeCollapseState />
		);
		expect(general.find('.glyphicon-chevron-down').length).toBe(1);
		expect(general.find(OutlineBlock).length).toBe(0);
	});

	it('should display a expanded block', () => {
		const general = shallow(
			<Outline metadataStructure={metadataStructureOpened} storeCollapseState />
		);
		expect(general.find('.glyphicon-chevron-up').length).toBe(1);
		expect(general.find(OutlineBlock).length).toBe(1);
	});
	it('should become a collapsed block if we click on the button', () => {
		const general = shallow(
			<Outline metadataStructure={metadataStructureClosed} storeCollapseState />
		);
		expect(general.find('.glyphicon-chevron-down').length).toBe(1);
		expect(general.find(OutlineBlock).length).toBe(0);

		general.find('button').simulate('click');

		expect(general.find('.glyphicon-chevron-up').length).toBe(1);
		expect(general.find(OutlineBlock).length).toBe(1);
	});
	it('should not use anchor', () => {
		const general = shallow(
			<Outline
				disableSectionAnchor
				metadataStructure={metadataStructureOpened}
				storeCollapseState
			/>
		);
		const links = general.find(Link);
		expect(links.length).toBe(1);
		expect(links.first().props().to).toBe('/operations/help/#1');
	});

	it('should not store the collapse status', () => {
		const general = shallow(
			<Outline metadataStructure={metadataStructureOpened} />
		);
		expect(general.find('.glyphicon-chevron-up').length).toBe(0);
		expect(general.find(OutlineBlock).length).toBe(0);
	});
});
