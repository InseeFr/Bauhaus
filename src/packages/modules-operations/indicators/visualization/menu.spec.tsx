import { render, screen } from '@testing-library/react';

import { ADMIN, INDICATOR_CONTRIBUTOR } from '../../../auth/roles';
import { Indicator } from '../../../model/operations/indicator';
import { RBACMock } from '../../../tests-utils/rbac';
import { Menu } from './menu';

describe('Family Home Page Menu', () => {
	describe('As an ADMIN', () => {
		it('can see the Back button', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Back');
		});
		it('can see the Sims View button if exists', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						indicator={{ creators: [], idSims: '1' } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Show the report');
		});
		it('can not see the Sims View button if undefined', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Show the report')).toBeNull();
		});
		it('can see the Sims Create button if undefined', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Create the report');
		});
		it('can not see the Sims View button if defined', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						indicator={{ creators: [], idSims: '1' } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Create the report')).toBeNull();
		});

		it('can see the Publish button', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Publish');
		});

		it('can see the Update', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Update');
		});
	});

	describe('As an INDICATOR_CONTRIBUTOR', () => {
		it('can see the Back button', () => {
			render(
				<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
					<Menu
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Back');
		});
		it('can see the Sims View button if exists', () => {
			render(
				<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
					<Menu
						indicator={{ creators: [], idSims: '1' } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Show the report');
		});
		it('can not see the Sims View button if undefined', () => {
			render(
				<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
					<Menu
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Show the report')).toBeNull();
		});

		it('can see the Sims Create button if undefined', () => {
			render(
				<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
					<Menu
						indicator={{ creators: ['stamp'] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Create the report');
		});

		it('can not see the Sims View button if defined', () => {
			render(
				<RBACMock roles={[ADMIN]}>
					<Menu
						indicator={{ creators: [], idSims: '1' } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Create the report')).toBeNull();
		});

		it('can not see the Sims View button if defined with wrong stamp', () => {
			render(
				<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
					<Menu
						indicator={
							{ creators: ['fake'], idSims: '1' } as unknown as Indicator
						}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Create the report')).toBeNull();
		});

		it('can see the Publish button if good stamp', () => {
			render(
				<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
					<Menu
						indicator={{ creators: ['stamp'] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Publish');
		});

		it('can not see the Publish button if bad stamp', () => {
			render(
				<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
					<Menu
						indicator={{ creators: ['fake'] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Publish')).toBeNull();
		});

		it('can see the Update button if good stamp', () => {
			render(
				<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
					<Menu
						indicator={{ creators: ['stamp'] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Update');
		});

		it('can not see the Update button if wrong stamp', () => {
			render(
				<RBACMock roles={[INDICATOR_CONTRIBUTOR]}>
					<Menu
						indicator={{ creators: ['fake'] } as unknown as Indicator}
						publish={vi.fn()}
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
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Back');
		});
		it('can see the Sims View button if exists', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						indicator={{ creators: [], idSims: '1' } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			screen.getByText('Show the report');
		});
		it('can not see the Sims View button if undefined', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Show the report')).toBeNull();
		});

		it('can not see the Sims Create button if undefined', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Create the report')).toBeNull();
		});
		it('can not see the Sims View button if defined', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						indicator={{ creators: [], idSims: '1' } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);

			expect(screen.queryByText('Create the report')).toBeNull();
		});
		it('can see the Publish button', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);
			expect(screen.queryByText('Publish')).toBeNull();
		});

		it('can see the Update', () => {
			render(
				<RBACMock roles={[]}>
					<Menu
						indicator={{ creators: [] } as unknown as Indicator}
						publish={vi.fn()}
					/>
				</RBACMock>,
			);
			expect(screen.queryByText('Update')).toBeNull();
		});
	});
});
