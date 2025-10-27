import { screen } from '@testing-library/dom';
import { Mock, vi } from 'vitest';

import { useAuthorizationGuard } from '../../auth/components/auth';
import D from '../../deprecated-locales';
import { renderWithRouter } from '../../tests/render';
import MenuConcepts from './index';

vi.mock('../../auth/components/auth', async (importOriginal) => {
	const actual =
		await importOriginal<typeof import('../../auth/components/auth')>();
	return {
		...actual,
		useAuthorizationGuard: vi.fn(),
	};
});

describe('menu-concepts', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should display the administration menu', () => {
		(useAuthorizationGuard as Mock).mockReturnValue(true);

		renderWithRouter(<MenuConcepts />, ['/concepts']);

		const links = screen.getAllByRole('link');

		expect(links).toHaveLength(5);
		expect(links[3].textContent).toBe(D.administrationTitle);
		expect(useAuthorizationGuard).toHaveBeenCalledWith({
			module: 'CONCEPT_CONCEPT',
			privilege: 'ADMINISTRATION',
		});
	});

	it('should not display the administration menu', () => {
		(useAuthorizationGuard as Mock).mockReturnValue(false);

		renderWithRouter(<MenuConcepts />, ['/concepts']);

		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(4);
		expect(useAuthorizationGuard).toHaveBeenCalledWith({
			module: 'CONCEPT_CONCEPT',
			privilege: 'ADMINISTRATION',
		});
	});
});
