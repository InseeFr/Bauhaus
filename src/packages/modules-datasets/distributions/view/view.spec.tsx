import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PageTitleBlock } from '@components/page-title-block';

import { Component } from './view';

vi.mock('react-router-dom', () => ({
	useParams: () => ({ id: 'test-id' }),
	MemoryRouter: vi.fn(),
	Route: vi.fn(),
	Routes: vi.fn(),
}));

vi.mock('@utils/hooks/useTitle', () => ({ useTitle: vi.fn() }));

vi.mock('@components/check-second-lang', () => ({
	CheckSecondLang: () => <div data-testid="check-second-lang" />,
}));

vi.mock('@components/errors-bloc', () => ({
	ErrorBloc: () => <div data-testid="error-bloc" />,
}));

vi.mock('@components/loading', () => ({
	Loading: () => <div data-testid="loading" />,
	Deleting: () => <div data-testid="deleting" />,
	Publishing: () => <div data-testid="publishing" />,
}));

vi.mock('@components/page-title-block', () => ({
	PageTitleBlock: vi.fn(() => <div data-testid="page-title-block" />),
}));

vi.mock('../../datasets', () => ({
	useDataset: () => ({ data: { idDataset: 'dataset-id' }, isLoading: false }),
	useDatasetDeleter: () => ({
		isDeleting: false,
		remove: vi.fn(),
		deleteServerSideError: null,
	}),
	useDatasetPublisher: () => ({
		isPublishing: false,
		publish: vi.fn(),
		validationServerSideError: null,
	}),
	useDistribution: () => ({
		data: { labelLg1: 'Title 1', labelLg2: 'Title 2', idDataset: 'dataset-id' },
		isLoading: false,
	}),
}));

vi.mock('./menu', () => ({
	ViewMenu: () => <div data-testid="view-menu" />,
}));

vi.mock('./view-main-block', () => ({
	ViewMainBlock: () => <div data-testid="view-main-block" />,
}));

describe('Component', () => {
	it('renders PageTitleBlock with correct props', () => {
		render(<Component />);

		expect(PageTitleBlock).toHaveBeenCalledWith(
			{
				titleLg1: 'Title 1',
				titleLg2: 'Title 2',
			},
			{},
		);
	});
});
