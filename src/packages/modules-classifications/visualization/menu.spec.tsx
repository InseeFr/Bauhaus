import { Classification } from '@model/Classification';
import { render, screen } from '@testing-library/react';

import { ADMIN } from '../../auth/roles';
import { RBACMock } from '../../tests-utils/rbac';
import Menu from './menu';

const classification = { id: 'pcs2020' } as unknown as Classification;

describe('classification-visualization-controls', () => {
	it('should contains the Back button', async () => {
		render(
			<RBACMock roles={[]}>
				<Menu classification={classification} publish={vi.fn()} />
			</RBACMock>,
		);
		await screen.findByText('Back');
	});

	it('should contains the Validate button if we are an ADMIN', async () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<Menu classification={classification} publish={vi.fn()} />
			</RBACMock>,
		);
		await screen.findByText('Publish');
	});

	it('should not contains the Validate button if we are not an ADMIN', async () => {
		render(
			<RBACMock roles={[]}>
				<Menu classification={classification} publish={vi.fn()} />
			</RBACMock>,
		);
		const publishButton = screen.queryByText('Publish');
		expect(publishButton).toBeNull();
	});

	it('should contains the Update link if we are an ADMIN', async () => {
		render(
			<RBACMock roles={[ADMIN]}>
				<Menu classification={classification} publish={vi.fn()} />
			</RBACMock>,
		);
		const link = await screen.findByText('Update');
		expect(link.getAttribute('href')).toEqual(
			'/classifications/classification/pcs2020/modify',
		);
	});

	it('should not contains the Update link if we are not an ADMIN', async () => {
		render(
			<RBACMock roles={[]}>
				<Menu classification={classification} publish={vi.fn()} />
			</RBACMock>,
		);
		const updateLink = screen.queryByText('Update');
		expect(updateLink).toBeNull();
	});

	it('should contains the Tree button', async () => {
		render(
			<RBACMock roles={[]}>
				<Menu classification={classification} publish={vi.fn()} />
			</RBACMock>,
		);
		await screen.findByText('View tree');
	});
});
