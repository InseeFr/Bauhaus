import { render } from '@testing-library/react';

import { ConditionalDisplay } from './conditional-display';

describe('ConditionalDisplay component', () => {
	it('renders children when data is non-empty array', () => {
		const { getByText } = render(
			<ConditionalDisplay data={[1, 2, 3]}>
				<div>Content to display</div>
			</ConditionalDisplay>,
		);
		getByText('Content to display');
	});

	it('does not render children when data is undefined', () => {
		const { queryByText } = render(
			<ConditionalDisplay data={undefined}>
				<div>Content to display</div>
			</ConditionalDisplay>,
		);
		expect(queryByText('Content to display')).toBeNull();
	});

	it('does not render children when data is an empty array', () => {
		const { queryByText } = render(
			<ConditionalDisplay data={[]}>
				<div>Content to display</div>
			</ConditionalDisplay>,
		);
		expect(queryByText('Content to display')).toBeNull();
	});

	it('does render children when data is a non empty string', () => {
		const { queryByText } = render(
			<ConditionalDisplay data="not an array">
				<div>Content to display</div>
			</ConditionalDisplay>,
		);
		queryByText('Content to display');
	});

	it('does not render children when data is a empty string', () => {
		const { queryByText } = render(
			<ConditionalDisplay data="">
				<div>Content to display</div>
			</ConditionalDisplay>,
		);
		expect(queryByText('Content to display')).toBeNull();
	});
});
