import { render, screen } from '@testing-library/react';

import { ADMIN } from '../../../auth/roles';
import { Series } from '../../../model/operations/series';
import { RBACMock } from '../../../tests-utils/rbac';

describe('Family Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('can See Create the report', async () => {
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
							application: 'OPERATION_SERIES',
							privileges: [
								{ privilege: 'CREATE', strategy: 'ALL' },
								{ privilege: 'READ', strategy: 'ALL' },
							],
						},
					],
				}),
			};
		});

		const { Menu } = await import('./menu');

		render(
			<RBACMock roles={[ADMIN]}>
				<Menu
					series={{ creators: [] } as unknown as Series}
					onPublish={vi.fn()}
				/>
			</RBACMock>,
		);

		screen.getByText('Back');
		expect(screen.queryByText('Show the report')).toBeNull();
		screen.getByText('Create the report');
	});

	it('can See Show the report', async () => {
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
							application: 'OPERATION_SERIES',
							privileges: [
								{ privilege: 'CREATE', strategy: 'ALL' },
								{ privilege: 'READ', strategy: 'ALL' },
							],
						},
					],
				}),
			};
		});

		const { Menu } = await import('./menu');

		render(
			<RBACMock roles={[ADMIN]}>
				<Menu
					series={{ creators: [], idSims: '1' } as unknown as Series}
					onPublish={vi.fn()}
				/>
			</RBACMock>,
		);

		screen.getByText('Back');
		screen.getByText('Show the report');
		expect(screen.queryByText('Create the report')).toBeNull();
	});

	it('can see the Publish button', async () => {
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
							application: 'OPERATION_SERIES',
							privileges: [{ privilege: 'PUBLISH', strategy: 'ALL' }],
						},
					],
				}),
			};
		});

		const { Menu } = await import('./menu');

		render(
			<RBACMock roles={[ADMIN]}>
				<Menu
					series={{ creators: [] } as unknown as Series}
					onPublish={vi.fn()}
				/>
			</RBACMock>,
		);

		screen.getByText('Publish');
	});

	it('can see the Update', async () => {
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
							application: 'OPERATION_SERIES',
							privileges: [{ privilege: 'UPDATE', strategy: 'ALL' }],
						},
					],
				}),
			};
		});

		const { Menu } = await import('./menu');

		render(
			<RBACMock roles={[ADMIN]}>
				<Menu
					series={{ creators: [] } as unknown as Series}
					onPublish={vi.fn()}
				/>
			</RBACMock>,
		);

		screen.getByText('Update');
	});
});
