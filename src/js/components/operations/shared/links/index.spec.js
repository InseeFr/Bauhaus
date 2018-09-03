import React from 'react';
import DisplayLinks from './index';
import { Note } from 'js/components/shared/note';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';

const langs = {
	lg1: 'fr',
	lg2: 'en',
};

describe('DisplayLinks', () => {
	xit('should display a list if we have multiple item', () => {
		const links = [{ id: 1 }, { id: 2 }];
		const component = shallow(
			<MemoryRouter>
				<DisplayLinks links={links} langs={langs} path="series/" />
			</MemoryRouter>
		);
		expect(component.html()).toContain('<li><a href="/series/1">');
		expect(component.html()).toContain('<li><a href="/series/2">');
	});
	xit('should display a paragraph if we have only one item', () => {
		const links = [{ id: 1 }];
		const component = shallow(
			<MemoryRouter>
				<DisplayLinks links={links} langs={langs} path="series/" />
			</MemoryRouter>
		);

		expect(component.html()).toContain(
			'<div className="panel-body"><a href="/series/1">'
		);
	});
	xit('should not display a link', () => {
		const links = [{ id: 1, labelLg1: 'labelLg1' }];
		const component = shallow(
			<MemoryRouter>
				<DisplayLinks
					links={links}
					langs={langs}
					path="series/"
					displayLink={false}
				/>
			</MemoryRouter>
		);
		expect(component.html()).toContain('<p>labelLg1');
	});
});
