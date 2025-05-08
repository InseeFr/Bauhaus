import { render, screen } from '@testing-library/react';

import {
	ADMIN,
	INDICATOR_CONTRIBUTOR,
	SERIES_CONTRIBUTOR,
} from '../../auth/roles';
import { RBACMock } from '../../tests-utils/rbac';
import { Menu } from './menu';

describe('Document Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('an admin can create a new structure if he does not have the Gestionnaire_structures_RMESGNCS role', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [
						{
							application: 'OPERATION_DOCUMENT',
							privileges: [{ privilege: 'CREATE', strategy: 'ALL' }],
						},
					],
				}),
			};
		});

		const { Menu } = await import('./menu');

		render(
			<RBACMock roles={[ADMIN]}>
				<Menu />
			</RBACMock>,
		);

		screen.getByText('New Link');
		screen.getByText('New Document');
	});

	it('a user without Admin or  INDICATOR_CONTRIBUTOR or SERIES_CONTRIBUTOR role cannot create a document', async () => {
		vi.doMock('@tanstack/react-query', async () => {
			const actual = await vi.importActual<
				typeof import('@tanstack/react-query')
			>('@tanstack/react-query');
			return {
				...actual,
				useQuery: vi.fn().mockReturnValue({
					isLoading: false,
					data: [
						{
							application: 'OPERATION_DOCUMENT',
							privileges: [],
						},
					],
				}),
			};
		});

		const { Menu } = await import('./menu');

		render(
			<RBACMock roles={[]}>
				<Menu />
			</RBACMock>,
		);

		expect(screen.queryByText('New Link')).toBeNull();
		expect(screen.queryByText('New Document')).toBeNull();
	});
});
