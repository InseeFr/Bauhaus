import { render, screen } from '@testing-library/react';

import { Sims } from '../../../../model/Sims';
import { RBACMock } from '../../../../tests/rbac';
import { mockReactQueryForRbac } from '../../../../tests/render';

describe('Family Home Page Menu', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});
	describe('As an SERIES_CONTRIBUTOR', () => {
		it('can see the Back button', async () => {
			mockReactQueryForRbac([
				{
					application: 'OPERATION_SIMS',
					privileges: [
						{ privilege: 'PUBLISH', strategy: 'ALL' },
						{ privilege: 'UPDATE', strategy: 'ALL' },
					],
				},
			]);

			const { Menu } = await import('./menu');

			render(
				<RBACMock>
					<Menu
						sims={{ series: { creators: [] } } as unknown as Sims}
						onPublish={vi.fn()}
						onExport={vi.fn()}
						onDelete={vi.fn()}
						owners={[]}
					/>
				</RBACMock>,
			);

			screen.getByText('Back');
			screen.getByText('Publish');
			screen.getByText('Update');
			screen.getByText('Export');
		});

		it('can not see the Sims View button if defined with good stamp but no siblings', async () => {
			mockReactQueryForRbac([
				{
					application: 'OPERATION_SIMS',
					privileges: [],
				},
			]);

			const { Menu } = await import('./menu');

			render(
				<RBACMock>
					<Menu
						sims={{} as unknown as Sims}
						onPublish={vi.fn()}
						onExport={vi.fn()}
						onDelete={vi.fn()}
						owners={['stamp']}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Publish')).toBeNull();
			expect(screen.queryByText('Update')).toBeNull();
		});
	});
});
