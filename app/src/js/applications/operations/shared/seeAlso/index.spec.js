import React from 'react';
import SeeAlso from './index';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const langs = {
	lg1: 'fr',
	lg2: 'en',
};

describe('SeeAlso', () => {
	it('should display one Note if the second lang is not selected', () => {
		const seeAlso = {};
		const { container } = render(<SeeAlso links={seeAlso} langs={langs} />);
		expect(container.querySelector('.wilco-note')).toBeDefined();
	});
	it('should display two Note if the second lang is selected', () => {
		const seeAlso = {};
		const { container } = render(
			<SeeAlso links={seeAlso} langs={langs} secondLang />
		);
		expect(container.querySelectorAll('.wilco-note')).toHaveLength(2);
	});
	it('should display indicators', () => {
		const seeAlso = {
			indicator: [{ id: 1, label: 'indicators' }],
		};
		const { container } = render(
			<MemoryRouter>
				<SeeAlso links={seeAlso} langs={langs} />
			</MemoryRouter>
		);
		expect(container.innerHTML).toContain('href="/operations/indicator/1"');
	});
	it('should display series', () => {
		const seeAlso = {
			series: [{ id: 1, label: 'indicators' }],
		};
		const { container } = render(
			<MemoryRouter>
				<SeeAlso links={seeAlso} langs={langs} />
			</MemoryRouter>
		);
		expect(container.innerHTML).toContain('href="/operations/series/1"');
	});
	it('should display families', () => {
		const seeAlso = {
			family: [{ id: 1, label: 'indicators' }],
		};
		const { container } = render(
			<MemoryRouter>
				<SeeAlso links={seeAlso} langs={langs} />
			</MemoryRouter>
		);
		expect(container.innerHTML).toContain('href="/operations/family/1"');
	});
	it('should display operations', () => {
		const seeAlso = {
			operation: [{ id: 1, label: 'indicators' }],
		};
		const { container } = render(
			<MemoryRouter>
				<SeeAlso links={seeAlso} langs={langs} />
			</MemoryRouter>
		);
		expect(container.innerHTML).toContain('href="/operations/operation/1"');
	});
});
