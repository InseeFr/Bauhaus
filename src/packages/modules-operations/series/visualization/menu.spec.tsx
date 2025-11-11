import { cleanup, render, screen } from '@testing-library/react';

import { Series } from '../../../model/operations/series';
import { RBACMock } from '../../../tests/rbac';
import { mockReactQueryForRbac } from '../../../tests/render';

describe('Family Home Page Menu', () => {
	afterEach(() => {
		cleanup();
		vi.resetModules();
		vi.clearAllMocks();
	});

	it(
		'can See Create the report',
		async () => {
			mockReactQueryForRbac([
				{
					application: 'OPERATION_SERIES',
					privileges: [
						{ privilege: 'CREATE', strategy: 'ALL' },
						{ privilege: 'READ', strategy: 'ALL' },
					],
				},
				{
					application: 'OPERATION_SIMS',
					privileges: [
						{ privilege: 'CREATE', strategy: 'ALL' },
						{ privilege: 'READ', strategy: 'ALL' },
					],
				},
			]);

			const { Menu } = await import('./menu');

			render(
				<RBACMock>
					<Menu
						series={{ creators: [] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Back');
			expect(screen.queryByText('Show the report')).toBeNull();
			screen.getByText('Create the report');
		},
		10000,
	);

	it('can See Show the report', async () => {
		mockReactQueryForRbac([
			{
				application: 'OPERATION_SERIES',
				privileges: [
					{ privilege: 'CREATE', strategy: 'ALL' },
					{ privilege: 'READ', strategy: 'ALL' },
				],
			},
		]);

		const { Menu } = await import('./menu');

		render(
			<RBACMock>
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
		mockReactQueryForRbac([
			{
				application: 'OPERATION_SERIES',
				privileges: [{ privilege: 'PUBLISH', strategy: 'ALL' }],
			},
		]);

		const { Menu } = await import('./menu');

		render(
			<RBACMock>
				<Menu
					series={{ creators: [] } as unknown as Series}
					onPublish={vi.fn()}
				/>
			</RBACMock>,
		);

		screen.getByText('Publish');
	});

	it('can see the Update', async () => {
		mockReactQueryForRbac([
			{
				application: 'OPERATION_SERIES',
				privileges: [{ privilege: 'UPDATE', strategy: 'ALL' }],
			},
		]);

		const { Menu } = await import('./menu');

		render(
			<RBACMock>
				<Menu
					series={{ creators: [] } as unknown as Series}
					onPublish={vi.fn()}
				/>
			</RBACMock>,
		);

		screen.getByText('Update');
	});
});
