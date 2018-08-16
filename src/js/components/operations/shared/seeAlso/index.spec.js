import React from 'react';
import SeeAlso from './index';
import { Note } from 'js/components/shared/note';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';

const langs = {
	lg1: 'fr',
	lg2: 'en',
};

describe('SeeAlso', () => {
	it('should display one Note if the second lang is not selected', () => {
		const seeAlso = {};
		const component = shallow(<SeeAlso links={seeAlso} langs={langs} />);
		expect(component.find(Note).length).toBe(1);
	});
	it('should display two Note if the second lang is selected', () => {
		const seeAlso = {};
		const component = shallow(
			<SeeAlso links={seeAlso} langs={langs} secondLang />
		);
		expect(component.find(Note).length).toBe(2);
	});
	it('should display indicators', () => {
		const seeAlso = {
			indicator: [{ id: 1, label: 'indicators' }],
		};
		const component = shallow(
			<MemoryRouter>
				<SeeAlso links={seeAlso} langs={langs} />
			</MemoryRouter>
		);
		expect(component.html()).toContain('href="/operations/indicator/1"');
	});
	it('should display series', () => {
		const seeAlso = {
			series: [{ id: 1, label: 'indicators' }],
		};
		const component = shallow(
			<MemoryRouter>
				<SeeAlso links={seeAlso} langs={langs} />
			</MemoryRouter>
		);
		expect(component.html()).toContain('href="/operations/series/1"');
	});
	it('should display families', () => {
		const seeAlso = {
			family: [{ id: 1, label: 'indicators' }],
		};
		const component = shallow(
			<MemoryRouter>
				<SeeAlso links={seeAlso} langs={langs} />
			</MemoryRouter>
		);
		expect(component.html()).toContain('href="/operations/family/1"');
	});
	it('should display operations', () => {
		const seeAlso = {
			operation: [{ id: 1, label: 'indicators' }],
		};
		const component = shallow(
			<MemoryRouter>
				<SeeAlso links={seeAlso} langs={langs} />
			</MemoryRouter>
		);
		expect(component.html()).toContain('href="/operations/operation/1"');
	});
});
