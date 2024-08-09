import SeeAlso from './index';
import { render } from '@testing-library/react';
import { renderWithRouter } from '../../../../new-architecture/tests-utils/render';
import { locales } from '../../../../new-architecture/tests-utils/default-values';

describe('SeeAlso', () => {
	it('should display one Note if the second lang is not selected', () => {
		const seeAlso = {};
		const { container } = render(<SeeAlso links={seeAlso} langs={locales} />);
		expect(container.querySelector('.wilco-note')).toBeDefined();
	});
	it('should display two Note if the second lang is selected', () => {
		const seeAlso = {};
		const { container } = render(
			<SeeAlso links={seeAlso} langs={locales} secondLang />
		);
		expect(container.querySelectorAll('.wilco-note')).toHaveLength(2);
	});
	it('should display indicators', () => {
		const seeAlso = {
			indicator: [{ id: 1, label: 'indicators' }],
		};
		const { container } = renderWithRouter(
			<SeeAlso links={seeAlso} langs={locales} />
		);
		expect(container.innerHTML).toContain('href="/operations/indicator/1"');
	});
	it('should display series', () => {
		const seeAlso = {
			series: [{ id: 1, label: 'indicators' }],
		};
		const { container } = renderWithRouter(
			<SeeAlso links={seeAlso} langs={locales} />
		);
		expect(container.innerHTML).toContain('href="/operations/series/1"');
	});
	it('should display families', () => {
		const seeAlso = {
			family: [{ id: 1, label: 'indicators' }],
		};
		const { container } = renderWithRouter(
			<SeeAlso links={seeAlso} langs={locales} />
		);
		expect(container.innerHTML).toContain('href="/operations/family/1"');
	});
	it('should display operations', () => {
		const seeAlso = {
			operation: [{ id: 1, label: 'indicators' }],
		};
		const { container } = renderWithRouter(
			<SeeAlso links={seeAlso} langs={locales} />
		);
		expect(container.innerHTML).toContain('href="/operations/operation/1"');
	});
});
