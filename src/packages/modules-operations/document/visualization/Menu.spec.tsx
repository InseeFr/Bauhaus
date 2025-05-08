import { render, screen } from '@testing-library/react';

import { ADMIN, INDICATOR_CONTRIBUTOR } from '../../../auth/roles';
import { Document } from '../../../model/operations/document';
import { RBACMock } from '../../../tests-utils/rbac';

describe('Document Visualization Page Menu', () => {
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
							privileges: [{ privilege: 'UPDATE', strategy: 'ALL' }],
						},
					],
				}),
			};
		});

		const { Menu } = await import('./Menu');

		render(
			<RBACMock roles={[ADMIN]}>
				<Menu document={{} as Document} type="type" />
			</RBACMock>,
		);

		screen.getByText('Update');
	});

	it('a user with INDICATOR_CONTRIBUTOR role can update a document if the stamp match', async () => {
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
							privileges: [{ privilege: 'UPDATE', strategy: 'STAMP' }],
						},
					],
				}),
			};
		});

		const { Menu } = await import('./Menu');

		render(
			<RBACMock roles={[INDICATOR_CONTRIBUTOR]} stamp="stamp">
				<Menu
					document={
						{
							id: '1',
							sims: [{ creators: ['stamp'] }],
						} as Document
					}
					type="type"
				/>
			</RBACMock>,
		);

		screen.getByText('Update');
	});

	it('a user with INDICATOR_CONTRIBUTOR role cannot update a document if the stamp does not match', async () => {
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
							privileges: [{ privilege: 'UPDATE', strategy: 'STAMP' }],
						},
					],
				}),
			};
		});

		const { Menu } = await import('./Menu');

		render(
			<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
				<Menu
					document={
						{
							id: '1',
							sims: [{ creators: ['fake'] }],
						} as Document
					}
					type="type"
				/>
			</RBACMock>,
		);

		expect(screen.queryByText('Update')).toBeNull();
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

		const { Menu } = await import('./Menu');

		render(
			<RBACMock roles={[]}>
				<Menu document={{} as Document} type="type" />
			</RBACMock>,
		);

		expect(screen.queryByText('Update')).toBeNull();
	});
});
