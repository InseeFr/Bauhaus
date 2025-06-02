import { useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { MainMenu } from '@components/menu';

import D from '../../deprecated-locales';
import { renderWithRouter } from '../../tests/render';
import MenuClassifications from './index';

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useLocation: vi.fn(),
	};
});

vi.mock('@components/menu', () => ({
	MainMenu: vi.fn(() => <div>MainMenu Mock</div>),
}));

describe('MenuClassifications', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should not render anything if the path is "/"', () => {
		vi.mocked(useLocation).mockReturnValue({ pathname: '/' } as any);

		const { container } = renderWithRouter(<MenuClassifications />);

		expect(container.firstChild).toBeNull();
	});

	it('should render the menu with paths, and highlight the active path', () => {
		vi.mocked(useLocation).mockReturnValue({
			pathname: '/classifications/families',
		} as any);

		renderWithRouter(<MenuClassifications />);

		expect(MainMenu).toHaveBeenCalledWith(
			{
				paths: [
					{
						path: '/classifications/families',
						pathKey: 'classifications/famil',
						className: 'active',
						attrs: { 'aria-current': 'page' },
						label: D.familiesTitle,
						order: 0,
					},
					{
						path: '/classifications/series',
						pathKey: 'classifications/series',
						className: null,
						attrs: null,
						label: D.seriesTitle,
						order: 1,
					},
					{
						path: '/classifications/correspondences',
						pathKey: 'classifications/correspondence',
						className: null,
						attrs: null,
						label: D.correspondencesTitle,
						order: 3,
					},
					{
						path: '/classifications',
						pathKey: 'classification',
						className: null,
						attrs: null,
						label: D.classificationsTitle,
						order: 2,
					},
				],
			},
			{},
		);
	});

	it('should mark the correct path as active based on location.pathname', () => {
		vi.mocked(useLocation).mockReturnValue({
			pathname: '/classifications/series',
		} as any);

		renderWithRouter(<MenuClassifications />);

		expect(MainMenu).toHaveBeenCalledWith(
			{
				paths: [
					{
						path: '/classifications/families',
						pathKey: 'classifications/famil',
						className: null,
						attrs: null,
						label: D.familiesTitle,
						order: 0,
					},
					{
						path: '/classifications/series',
						pathKey: 'classifications/series',
						className: 'active',
						attrs: { 'aria-current': 'page' },
						label: D.seriesTitle,
						order: 1,
					},
					{
						path: '/classifications/correspondences',
						pathKey: 'classifications/correspondence',
						className: null,
						attrs: null,
						label: D.correspondencesTitle,
						order: 3,
					},
					{
						path: '/classifications',
						pathKey: 'classification',
						className: null,
						attrs: null,
						label: D.classificationsTitle,
						order: 2,
					},
				],
			},
			{},
		);
	});

	it('should apply "active" to the root classification path if no specific path matches', () => {
		vi.mocked(useLocation).mockReturnValue({
			pathname: '/classifications',
		} as any);

		renderWithRouter(<MenuClassifications />);

		expect(MainMenu).toHaveBeenCalledWith(
			{
				paths: [
					{
						path: '/classifications/families',
						pathKey: 'classifications/famil',
						className: null,
						attrs: null,
						label: D.familiesTitle,
						order: 0,
					},
					{
						path: '/classifications/series',
						pathKey: 'classifications/series',
						className: null,
						attrs: null,
						label: D.seriesTitle,
						order: 1,
					},
					{
						path: '/classifications/correspondences',
						pathKey: 'classifications/correspondence',
						className: null,
						attrs: null,
						label: D.correspondencesTitle,
						order: 3,
					},
					{
						path: '/classifications',
						pathKey: 'classification',
						className: 'active',
						attrs: { 'aria-current': 'page' },
						label: D.classificationsTitle,
						order: 2,
					},
				],
			},
			{},
		);
	});
});
