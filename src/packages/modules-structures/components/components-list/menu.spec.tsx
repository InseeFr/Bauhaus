import { render, screen } from '@testing-library/react';

import { ADMIN, STRUCTURE_CONTRIBUTOR } from '../../../auth/roles';
import { RBACMock } from '../../../tests-utils/rbac';
import { HomePageMenu } from './menu';

describe('Components Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it.only('an admin can create a new component if he does not have the Gestionnaire_structures_RMESGNCS role', async () => {
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
							application: 'STRUCTURE_COMPONENT',
							privileges: [{ privilege: 'CREATE', strategy: 'ALL' }],
						},
					],
				}),
			};
		});

		const { HomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[ADMIN]}>
				<HomePageMenu filter="" />
			</RBACMock>,
		);

		screen.getByText('New');
	});

	it('a user without Admin or  Gestionnaire_structures_RMESGNCS role cannot create a component', async () => {
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
							application: 'STRUCTURE_COMPONENT',
							privileges: [],
						},
					],
				}),
			};
		});

		const { HomePageMenu } = await import('./menu');

		render(
			<RBACMock roles={[]}>
				<HomePageMenu filter="" />
			</RBACMock>,
		);

		expect(screen.queryByText('New')).toBeNull();
	});
});
