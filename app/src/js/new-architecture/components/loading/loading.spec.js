import React from 'react';
import { render, screen } from '@testing-library/react';
import { Loading, Deleting, Publishing } from './loading';
import D from '../i18n';

jest.mock('../i18n', () => ({
	loadableAuth: 'Authenticating...',
	loadableSaving: 'Saving...',
	loadableDeleting: 'Deleting...',
	loadableSending: 'Sending...',
	loadableExporting: 'Exporting...',
	loadableValidating: 'Validating...',
	loadableLoading: 'Loading...',
}));

describe('Loading Component', () => {
	it('renders with default loading text', () => {
		render(<Loading />);
		expect(
			screen.getByRole('heading', { name: D.loadableLoading })
		).not.toBeNull();
	});

	it('renders with custom text', () => {
		const customText = 'Custom loading text';
		render(<Loading text={customText} />);
		expect(screen.getByRole('heading', { name: customText })).not.toBeNull();
	});

	it('renders with authentification text type', () => {
		render(<Loading textType="authentification" />);
		expect(
			screen.getByRole('heading', { name: D.loadableAuth })
		).not.toBeNull();
	});

	it('renders with deleting text type', () => {
		render(<Deleting />);
		expect(
			screen.getByRole('heading', { name: D.loadableDeleting })
		).not.toBeNull();
	});

	it('renders with validating text type', () => {
		render(<Publishing />);
		expect(
			screen.getByRole('heading', { name: D.loadableValidating })
		).not.toBeNull();
	});
});
