import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

import D from '../i18n';
import { Loading, Deleting, Publishing, Saving, Exporting } from './';

vi.mock('../i18n', () => ({
	default: {
		loading: {
			auth: 'Authenticating...',
			saving: 'Saving...',
			deleting: 'Deleting...',
			sending: 'Sending...',
			exporting: 'Exporting...',
			validating: 'Validating...',
			loading: 'Loading...',
		},
	},
}));

vi.mock('primereact/progressspinner', () => ({
	ProgressSpinner: () => <div data-testid="progress-spinner">Spinner</div>,
}));

describe('Loading Component', () => {
	it('renders with default loading text', () => {
		render(<Loading />);
		const statusElement = screen.getByRole('status');
		expect(statusElement).toBeInTheDocument();
		expect(statusElement).toHaveAttribute('aria-label', D.loading.loading);
		expect(screen.getByText(D.loading.loading)).toBeInTheDocument();
	});

	it('renders with custom text', () => {
		const customText = 'Custom loading text';
		render(<Loading text={customText} />);
		const statusElement = screen.getByRole('status');
		expect(statusElement).toHaveAttribute('aria-label', customText);
		expect(screen.getByText(customText)).toBeInTheDocument();
	});

	it('renders with authentification text type', () => {
		render(<Loading textType="authentification" />);
		const statusElement = screen.getByRole('status');
		expect(statusElement).toHaveAttribute('aria-label', D.loading.auth);
		expect(screen.getByText(D.loading.auth)).toBeInTheDocument();
	});

	it('renders with saving text type', () => {
		render(<Loading textType="saving" />);
		const statusElement = screen.getByRole('status');
		expect(statusElement).toHaveAttribute('aria-label', D.loading.saving);
		expect(screen.getByText(D.loading.saving)).toBeInTheDocument();
	});

	it('renders with sending text type', () => {
		render(<Loading textType="sending" />);
		const statusElement = screen.getByRole('status');
		expect(statusElement).toHaveAttribute('aria-label', D.loading.sending);
		expect(screen.getByText(D.loading.sending)).toBeInTheDocument();
	});

	it('renders with exporting text type', () => {
		render(<Loading textType="exporting" />);
		const statusElement = screen.getByRole('status');
		expect(statusElement).toHaveAttribute('aria-label', D.loading.exporting);
		expect(screen.getByText(D.loading.exporting)).toBeInTheDocument();
	});

	it('has correct accessibility attributes', () => {
		render(<Loading />);
		const statusElement = screen.getByRole('status');
		expect(statusElement).toHaveAttribute('aria-live', 'polite');
		expect(statusElement).toHaveAttribute('aria-label');
	});

	it('renders ProgressSpinner component', () => {
		render(<Loading />);
		expect(screen.getByTestId('progress-spinner')).toBeInTheDocument();
	});

	describe('Deleting component', () => {
		it('renders with deleting text type', () => {
			render(<Deleting />);
			const statusElement = screen.getByRole('status');
			expect(statusElement).toHaveAttribute('aria-label', D.loading.deleting);
			expect(screen.getByText(D.loading.deleting)).toBeInTheDocument();
		});
	});

	describe('Publishing component', () => {
		it('renders with validating text type', () => {
			render(<Publishing />);
			const statusElement = screen.getByRole('status');
			expect(statusElement).toHaveAttribute('aria-label', D.loading.validating);
			expect(screen.getByText(D.loading.validating)).toBeInTheDocument();
		});
	});

	describe('Saving component', () => {
		it('renders with saving text type', () => {
			render(<Saving />);
			const statusElement = screen.getByRole('status');
			expect(statusElement).toHaveAttribute('aria-label', D.loading.saving);
			expect(screen.getByText(D.loading.saving)).toBeInTheDocument();
		});
	});

	describe('Exporting component', () => {
		it('renders with exporting text type', () => {
			render(<Exporting />);
			const statusElement = screen.getByRole('status');
			expect(statusElement).toHaveAttribute('aria-label', D.loading.exporting);
			expect(screen.getByText(D.loading.exporting)).toBeInTheDocument();
		});
	});
});
