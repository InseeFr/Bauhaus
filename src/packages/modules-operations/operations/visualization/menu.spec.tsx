import { render, screen } from '@testing-library/react';

import { ADMIN } from '../../../auth/roles';
import { Operation } from '../../../model/Operation';
import { RBACMock } from '../../../tests/rbac';
import { mockReactQueryForRbac } from '../../../tests/render';

describe('Family Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	describe('As an ADMIN', () => {
		it('can see the Back button', async () => {
			mockReactQueryForRbac([
				{
					application: 'OPERATION_OPERATION',
					privileges: [],
				},
			]);
			const { Menu } = await import('./menu');

			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						operation={{ series: { creators: [] } } as unknown as Operation}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Back');
		});

		it('can see the Sims View button if exists', async () => {
			mockReactQueryForRbac([
				{
					application: 'OPERATION_OPERATION',
					privileges: [],
				},
			]);
			const { Menu } = await import('./menu');

			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						operation={
							{ series: { creators: [] }, idSims: '1' } as unknown as Operation
						}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Show the report');
		});
		it('can not see the Sims View button if undefined', async () => {
			mockReactQueryForRbac([
				{
					application: 'OPERATION_OPERATION',
					privileges: [],
				},
			]);
			const { Menu } = await import('./menu');
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						operation={{ series: { creators: [] } } as unknown as Operation}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Show the report')).toBeNull();
		});
		it('can see the Sims Create button if undefined', async () => {
			mockReactQueryForRbac([
				{
					application: 'OPERATION_SIMS',
					privileges: [{ privilege: 'CREATE', strategy: 'ALL' }],
				},
			]);
			const { Menu } = await import('./menu');

			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						operation={{ series: { creators: [] } } as unknown as Operation}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Create the report');
		});
		it('can not see the Sims View button if defined', async () => {
			mockReactQueryForRbac([
				{
					application: 'OPERATION_SIMS',
					privileges: [{ privilege: 'CREATE', strategy: 'ALL' }],
				},
			]);
			const { Menu } = await import('./menu');

			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						operation={
							{ series: { creators: [] }, idSims: '1' } as unknown as Operation
						}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Create the report')).toBeNull();
		});

		it('can see the Publish button', async () => {
			mockReactQueryForRbac([
				{
					application: 'OPERATION_OPERATION',
					privileges: [{ privilege: 'PUBLISH', strategy: 'ALL' }],
				},
			]);
			const { Menu } = await import('./menu');
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						operation={{ series: { creators: [] } } as unknown as Operation}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Publish');
		});

		it('can see the Update', async () => {
			mockReactQueryForRbac([
				{
					application: 'OPERATION_OPERATION',
					privileges: [{ privilege: 'UPDATE', strategy: 'ALL' }],
				},
			]);
			const { Menu } = await import('./menu');

			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						operation={{ series: { creators: [] } } as unknown as Operation}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Update');
		});
	});
});
