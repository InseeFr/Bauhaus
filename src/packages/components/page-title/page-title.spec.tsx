import { render } from '@testing-library/react';

import { PageTitle } from '.';

describe('page-title', () => {
	it('renders without crashing', () => {
		render(<PageTitle title="title" subtitle="subtitle" />);
	});

	it('returns component title', () => {
		const { container } = render(<PageTitle title="title" />);
		expect(
			container.querySelector('.wilco-page-title__title')!.innerHTML,
		).toEqual('title');
	});

	it('returns component text', () => {
		const { container } = render(
			<PageTitle title="title" subtitle="subtitle" />,
		);
		expect(
			container.querySelector('.wilco-page-title__title')!.innerHTML,
		).toEqual('title<div>" subtitle "</div>');
	});

	it('returns component into row', () => {
		const { container } = render(
			<PageTitle title="title" subtitle="subtitle" />,
		);
		expect(container.querySelectorAll('.row')).toHaveLength(1);
	});
});
