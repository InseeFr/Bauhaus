import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GlobalErrorBloc } from './GlobalErrorBloc';

vi.mock('primereact/card', () => ({
	Card: ({ title, children }: any) => (
		<div data-testid="card">
			<h2>{title}</h2>
			{children}
		</div>
	),
}));

describe('GlobalErrorBloc', () => {
	it('should render with title and message', () => {
		render(
			<GlobalErrorBloc title="Error Title" message="Error message content" />,
		);

		expect(screen.getByText('Error Title')).toBeInTheDocument();
		expect(screen.getByText('Error message content')).toBeInTheDocument();
	});

	it('should render the card component', () => {
		render(<GlobalErrorBloc title="Test" message="Test message" />);

		expect(screen.getByTestId('card')).toBeInTheDocument();
	});

	it('should have the correct CSS class', () => {
		const { container } = render(
			<GlobalErrorBloc title="Test" message="Test message" />,
		);

		const wrapperDiv = container.firstChild;
		expect(wrapperDiv).toHaveClass('global-error-bloc');
	});

	it('should render message in a paragraph tag', () => {
		const { container } = render(
			<GlobalErrorBloc title="Error" message="This is the error message" />,
		);

		const paragraph = container.querySelector('p');
		expect(paragraph).toBeInTheDocument();
		expect(paragraph).toHaveTextContent('This is the error message');
	});

	it('should pass the title prop to the Card component', () => {
		const title = 'Custom Error Title';
		render(<GlobalErrorBloc title={title} message="Some message" />);

		expect(screen.getByText(title)).toBeInTheDocument();
	});
});
