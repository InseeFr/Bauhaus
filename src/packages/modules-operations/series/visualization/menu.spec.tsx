import { render, screen } from '@testing-library/react';

import { ADMIN, SERIES_CONTRIBUTOR } from '../../../auth/roles';
import { Series } from '../../../model/operations/series';
import { RBACMock } from '../../../tests-utils/rbac';
import { Menu } from './menu';

describe('Family Home Page Menu', () => {
	describe('As an ADMIN', () => {
		it('can see the Back button', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						series={{ creators: [] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Back');
		});
		it('can see the Sims View button if exists', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						series={{ creators: [], idSims: '1' } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Show the report');
		});
		it('can not see the Sims View button if undefined', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						series={{ creators: [] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Show the report')).toBeNull();
		});
		it('can see the Sims Create button if undefined', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						series={{ creators: [] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Create the report');
		});
		it('can not see the Sims View button if defined', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						series={{ creators: [], idSims: '1' } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Create the report')).toBeNull();
		});

		it('can see the Publish button', () => {
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

		it('can see the Update', () => {
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

	describe('As an SERIES_CONTRIBUTOR', () => {
		it('can see the Back button', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						series={{ creators: [] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Back');
		});
		it('can see the Sims View button if exists', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						series={{ creators: [], idSims: '1' } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Show the report');
		});
		it('can not see the Sims View button if undefined', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						series={{ creators: [] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Show the report')).toBeNull();
		});

		it('can see the Sims Create button if undefined', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						series={{ creators: ['stamp'] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Create the report');
		});

		it('can not see the Sims View button if defined', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						series={{ creators: [], idSims: '1' } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Create the report')).toBeNull();
		});

		it('can not see the Sims View button if defined with wrong stamp', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						series={{ creators: ['fake'], idSims: '1' } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Create the report')).toBeNull();
		});

		it('can see the Publish button if good stamp', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						series={{ creators: ['stamp'] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Publish');
		});

		it('can not see the Publish button if bad stamp', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						series={{ creators: ['fake'] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Publish')).toBeNull();
		});

		it('can see the Update button if good stamp', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						series={{ creators: ['stamp'] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Update');
		});

		it('can not see the Update button if wrong stamp', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						series={{ creators: ['fake'] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);
			expect(screen.queryByText('Update')).toBeNull();
		});
	});

	describe('As an anonymous', () => {
		it('can see the Back button', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						series={{ creators: [] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Back');
		});
		it('can see the Sims View button if exists', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						series={{ creators: [], idSims: '1' } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Show the report');
		});
		it('can not see the Sims View button if undefined', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						series={{ creators: [] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Show the report')).toBeNull();
		});

		it('can not see the Sims Create button if undefined', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						series={{ creators: [] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Create the report')).toBeNull();
		});
		it('can not see the Sims View button if defined', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						series={{ creators: [], idSims: '1' } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Create the report')).toBeNull();
		});
		it('can see the Publish button', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						series={{ creators: [] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);
			expect(screen.queryByText('Publish')).toBeNull();
		});

		it('can see the Update', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						series={{ creators: [] } as unknown as Series}
						onPublish={vi.fn()}
					/>
				</RBACMock>,
			);
			expect(screen.queryByText('Update')).toBeNull();
		});
	});
});
