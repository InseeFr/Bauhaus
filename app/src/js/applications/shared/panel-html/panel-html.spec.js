import React from 'react';
import { render } from '@testing-library/react';
import PanelHtml from './';

describe('panel-html', () => {
	it('renders without crashing', () => {
		render(<PanelHtml title="title">{'<div>Text<div>'}</PanelHtml>);
	});

	it('returns component title', () => {
		const { container } = render(
			<PanelHtml title="title">{'<div>Text<div>'}</PanelHtml>
		);
		expect(container.querySelector('.panel-title').innerHTML).toEqual('title');
	});

	it('returns panel body', () => {
		const { container } = render(
			<PanelHtml title="title">{'<div>Text<div>'}</PanelHtml>
		);
		expect(container.querySelector('.panel-body')).toBeDefined();
	});
});
