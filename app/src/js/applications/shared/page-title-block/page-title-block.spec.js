import React from 'react';
import { render } from '@testing-library/react';
import PageTitleBlock from './';

describe('page-title-bloc', () => {
	it('renders one PageTitle only is secondLang is false', () => {
		const { container } = render(<PageTitleBlock titleLg1="titleLg1" />);
		expect(container.querySelectorAll('h1')).toHaveLength(1);
		expect(container.querySelectorAll('.wilco-page-subtitle')).toHaveLength(0);
	});

	it('renders one PageTitle only is titleLg2 is undefined', () => {
		const { container } = render(
			<PageTitleBlock titleLg1="titleLg1" secondLang={true} />
		);
		expect(container.querySelectorAll('h1')).toHaveLength(1);
		expect(container.querySelectorAll('.wilco-page-subtitle')).toHaveLength(0);
	});

	it('renders one PageTitle and one PageSubstitle', () => {
		const { container } = render(
			<PageTitleBlock
				titleLg1="titleLg1"
				titleLg2="titleLg2"
				secondLang={true}
			/>
		);
		expect(container.querySelectorAll('h1')).toHaveLength(1);
		expect(container.querySelectorAll('.wilco-page-subtitle')).toHaveLength(1);
	});
});
