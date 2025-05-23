import { useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MainMenu } from '@components/menu';

import MenuCodelists from '.';
import { ADMIN } from '../../auth/roles';
import { usePermission } from '../../redux/hooks/usePermission';
import { renderWithRouter } from '../../tests-utils/render';
import D from '../i18n/build-dictionary';

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useLocation: vi.fn(),
	};
});

vi.mock('../../redux/hooks/usePermission', () => ({
	usePermission: vi.fn(),
}));

vi.mock('@components/menu', () => ({
	MainMenu: vi.fn(() => <div>MainMenu Mock</div>),
}));

describe('MenuCodelists', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should not render anything if the path is "/"', () => {
		vi.mocked(useLocation).mockReturnValue({ pathname: '/' } as any);
		vi.mocked(usePermission).mockReturnValue({ roles: [] } as any);

		const { container } = renderWithRouter(<MenuCodelists />);

		expect(container.firstChild).toBeNull();
	});

	it('should render the menu with only default paths if user does not have ADMIN role', () => {
		vi.mocked(useLocation).mockReturnValue({ pathname: '/codelists' } as any);
		vi.mocked(usePermission).mockReturnValue({ roles: [] } as any);

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
	});

	it('should render the menu with additional paths if user has ADMIN role', () => {
		vi.mocked(useLocation).mockReturnValue({
			pathname: '/codelists/partial',
		} as any);
		vi.mocked(usePermission).mockReturnValue({ roles: [ADMIN] } as any);

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
	});

	it('should apply "active" class to the correct path based on location.pathname', () => {
		vi.mocked(useLocation).mockReturnValue({ pathname: '/codelists' } as any);
		vi.mocked(usePermission).mockReturnValue({ roles: [ADMIN] } as any);

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
	});
});
