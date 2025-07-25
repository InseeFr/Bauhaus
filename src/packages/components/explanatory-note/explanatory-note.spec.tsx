import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExplanatoryNote } from './';

describe('ExplanatoryNote', () => {
	it('renders nothing when text is undefined', () => {
		const { container } = render(<ExplanatoryNote title="My Title" />);
		expect(container.querySelector('.col-md-6')).toBeInTheDocument();
		expect(container).not.toHaveTextContent();
	});

	it('renders markdown content when md is true', () => {
		const { container } = render(
			<ExplanatoryNote title="MD Title" text={'**bold**'} md />,
		);

		expect(container.querySelector('.wmde-markdown strong')).toHaveTextContent(
			'bold',
		);
	});

	it('uses col-md-12 when alone is true', () => {
		const { container } = render(
			<ExplanatoryNote title="Alone" text="Hello" alone />,
		);
		expect(container.querySelector('.col-md-12')).toBeInTheDocument();
	});

	it('uses col-md-6 when alone is false', () => {
		const { container } = render(
			<ExplanatoryNote title="Not Alone" text="Hello" />,
		);
		expect(container.querySelector('.col-md-6')).toBeInTheDocument();
	});
});
