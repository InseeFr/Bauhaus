import { render, screen } from '@testing-library/react';

import { Classification } from '@model/Classification';

import { RBACMock } from '../../tests/rbac';
import { mockReactQueryForRbac } from '../../tests/render';

const classification = { id: 'pcs2020' } as unknown as Classification;

describe('classification-visualization-controls', () => {
	afterEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('should contains the Back button', async () => {
		mockReactQueryForRbac([
			{
				application: 'CLASSIFICATION_CLASSIFICATION',
				privileges: [{ privilege: 'PUBLISH', strategy: 'ALL' }],
			},
		]);

		const { default: Menu } = await import('./menu');

		render(
			<RBACMock>
				<Menu classification={classification} publish={vi.fn()} />
			</RBACMock>,
		);
		await screen.findByText('Back');
		await screen.findByText('Publish');
		await screen.findByText('View tree');
	});

	it('should not contains the Validate button', async () => {
		mockReactQueryForRbac([
			{
				application: 'CLASSIFICATION_CLASSIFICATION',
				privileges: [],
			},
		]);

		const { default: Menu } = await import('./menu');

		render(
			<RBACMock>
				<Menu classification={classification} publish={vi.fn()} />
			</RBACMock>,
		);
		const publishButton = screen.queryByText('Publish');
		expect(publishButton).toBeNull();

		const updateLink = screen.queryByText('Update');
		expect(updateLink).toBeNull();
	});

	it('should contains the Update link', async () => {
		mockReactQueryForRbac([
			{
				application: 'CLASSIFICATION_CLASSIFICATION',
				privileges: [{ privilege: 'UPDATE', strategy: 'ALL' }],
			},
		]);

		const { default: Menu } = await import('./menu');

		render(
			<RBACMock>
				<Menu classification={classification} publish={vi.fn()} />
			</RBACMock>,
		);
		const link = await screen.findByText('Update');
		expect(link.getAttribute('href')).toEqual(
			'/classifications/classification/pcs2020/modify',
		);
	});
});
