import { render, screen } from '@testing-library/react';
import { Menu } from './menu';
import { RBACMock } from '../../../../tests-utils/rbac';
import { SERIES_CONTRIBUTOR } from '../../../../auth/roles';
import { Sims } from '../../../../model/Sims';

describe('Family Home Page Menu', () => {
	describe('As an SERIES_CONTRIBUTOR', () => {
		it('can see the Back button', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						sims={{ series: { creators: [] } } as unknown as Sims}
						onPublish={jest.fn()}
						onExport={jest.fn()}
						onDelete={jest.fn()}
						owners={[]}
					/>
				</RBACMock>
			);

			screen.getByText('Back');
		});

		it('can see the Sims View button if defined with good stamp', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						sims={{ parentsWithoutSims: ['1'] } as unknown as Sims}
						onPublish={jest.fn()}
						onExport={jest.fn()}
						onDelete={jest.fn()}
						owners={['stamp']}
					/>
				</RBACMock>
			);

			screen.getByText('Duplicate');
		});

		it('can not see the Sims View button if defined with good stamp but no siblings', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						sims={{} as unknown as Sims}
						onPublish={jest.fn()}
						onExport={jest.fn()}
						onDelete={jest.fn()}
						owners={['stamp']}
					/>
				</RBACMock>
			);

			expect(screen.queryByText('Duplicate')).toBeNull();
		});

		it('can not see the Sims View button if defined with wrong stamp', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						sims={{} as unknown as Sims}
						onPublish={jest.fn()}
						onExport={jest.fn()}
						onDelete={jest.fn()}
						owners={[]}
					/>
				</RBACMock>
			);

			expect(screen.queryByText('Duplicate')).toBeNull();
		});

		it('can see the Publish button if good stamp', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						sims={{ series: { creators: ['stamp'] } } as unknown as Sims}
						onPublish={jest.fn()}
						onExport={jest.fn()}
						onDelete={jest.fn()}
						owners={['stamp']}
					/>
				</RBACMock>
			);

			screen.getByText('Publish');
		});

		it('can not see the Publish button if bad stamp', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						sims={{ series: { creators: ['fake'] } } as unknown as Sims}
						onPublish={jest.fn()}
						onExport={jest.fn()}
						onDelete={jest.fn()}
						owners={[]}
					/>
				</RBACMock>
			);

			expect(screen.queryByText('Publish')).toBeNull();
		});

		it('can see the Update button if good stamp', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						sims={{ series: { creators: ['stamp'] } } as unknown as Sims}
						onPublish={jest.fn()}
						onExport={jest.fn()}
						onDelete={jest.fn()}
						owners={['stamp']}
					/>
				</RBACMock>
			);

			screen.getByText('Update');
		});

		it('can not see the Update button if wrong stamp', () => {
			render(
				<RBACMock roles={[SERIES_CONTRIBUTOR]}>
					<Menu
						sims={{ series: { creators: ['fake'] } } as unknown as Sims}
						onPublish={jest.fn()}
						onExport={jest.fn()}
						onDelete={jest.fn()}
						owners={[]}
					/>
				</RBACMock>
			);
			expect(screen.queryByText('Update')).toBeNull();
		});
	});

	it('can see the Export button', () => {
		render(
			<RBACMock roles={[SERIES_CONTRIBUTOR]}>
				<Menu
					sims={{ series: { creators: ['stamp'] } } as unknown as Sims}
					onPublish={jest.fn()}
					onExport={jest.fn()}
					onDelete={jest.fn()}
					owners={['stamp']}
				/>
			</RBACMock>
		);

		screen.getByText('Export');
	});
});