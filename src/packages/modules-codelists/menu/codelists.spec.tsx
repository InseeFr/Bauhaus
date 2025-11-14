import { useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { MainMenu } from '@components/menu';

import MenuCodelists from '.';
import { useAuthorizationGuard } from '../../auth/components/auth';
import { renderWithRouter } from '../../tests/render';
import D from '../i18n/build-dictionary';

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useLocation: vi.fn(),
	};
});

vi.mock('../../auth/components/auth', async () => {
	const actual = await vi.importActual('../../auth/components/auth');
	return {
		...actual,
		useAuthorizationGuard: vi.fn(),
	};
});

vi.mock('@components/menu', () => ({
	MainMenu: vi.fn(() => <div>MainMenu Mock</div>),
}));

describe('MenuCodelists', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should not render anything if the path is "/"', () => {
		vi.mocked(useLocation).mockReturnValue({ pathname: '/' } as any);
		vi.mocked(useAuthorizationGuard).mockReturnValue(false);

		const { container } = renderWithRouter(<MenuCodelists />);

		expect(container.firstChild).toBeNull();
	});

	it('should render the menu with only default paths if user does not have administration privilege', () => {
		vi.mocked(useLocation).mockReturnValue({ pathname: '/codelists' } as any);
		vi.mocked(useAuthorizationGuard).mockReturnValue(false);

		const { getByText } = renderWithRouter(<MenuCodelists />);

		expect(MainMenu).toHaveBeenCalledWith(
			{
				paths: [
					{
						path: '/codelists',
						pathKey: 'codelists',
						className: 'active',
						attrs: { 'aria-current': 'page' },
						label: D.codelistsTitle,
						order: 1,
					},
				],
			},
			{},
		);
		expect(getByText('MainMenu Mock')).toBeTruthy();
		expect(useAuthorizationGuard).toHaveBeenCalledWith({
			module: 'CODESLIST_CODESLIST',
			privilege: 'READ',
		});
	});

	it('should render the menu with additional paths if user has administration privilege', () => {
		vi.mocked(useLocation).mockReturnValue({
			pathname: '/codelists/partial',
		} as any);
		vi.mocked(useAuthorizationGuard).mockReturnValue(true);

		const { getByText } = renderWithRouter(<MenuCodelists />);

		expect(MainMenu).toHaveBeenCalledWith(
			{
				paths: [
					{
						path: '/codelists/partial',
						pathKey: 'partial',
						className: 'active',
						attrs: { 'aria-current': 'page' },
						label: D.codelistsPartialTitle,
						order: 2,
					},
					{
						path: '/codelists',
						pathKey: 'codelists',
						className: null,
						attrs: null,
						label: D.codelistsTitle,
						order: 1,
					},
				],
			},
			{},
		);
		expect(getByText('MainMenu Mock')).toBeTruthy();
		expect(useAuthorizationGuard).toHaveBeenCalledWith({
			module: 'CODESLIST_CODESLIST',
			privilege: 'READ',
		});
	});

	it('should apply "active" class to the correct path based on location.pathname', () => {
		vi.mocked(useLocation).mockReturnValue({ pathname: '/codelists' } as any);
		vi.mocked(useAuthorizationGuard).mockReturnValue(true);

		renderWithRouter(<MenuCodelists />);

		expect(MainMenu).toHaveBeenCalledWith(
			{
				paths: [
					{
						path: '/codelists/partial',
						pathKey: 'partial',
						className: null,
						attrs: null,
						label: D.codelistsPartialTitle,
						order: 2,
					},
					{
						path: '/codelists',
						pathKey: 'codelists',
						className: 'active',
						attrs: { 'aria-current': 'page' },
						label: D.codelistsTitle,
						order: 1,
					},
				],
			},
			{},
		);
		expect(useAuthorizationGuard).toHaveBeenCalledWith({
			module: 'CODESLIST_CODESLIST',
			privilege: 'READ',
		});
	});
});
