// relations.test.tsx
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { vi } from 'vitest';

import RelationsView from './';

vi.mock('@components/layout', () => ({
	Row: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@components/note', () => ({
	Note: ({ text, title }: { text: React.ReactNode; title: string }) => (
		<div>
			<h2>{title}</h2>
			<div>{text}</div>
		</div>
	),
}));

describe('RelationsView Component', () => {
	const parent = {
		id: 'parent1',
		labelLg1: 'Libellé Parent Lg1',
		labelLg2: 'Libellé Parent Lg2',
	};
	const children = [
		{
			id: 'child1',
			labelLg1: 'Libellé Enfant 1 Lg1',
			labelLg2: 'Libellé Enfant 1 Lg2',
		},
		{
			id: 'child2',
			labelLg1: 'Libellé Enfant 2 Lg1',
			labelLg2: 'Libellé Enfant 2 Lg2',
		},
	];

	const defaultProps = {
		parent,
		parentTitle: 'parentTitle',
		parentPath: 'parentPath',
		children,
		childrenTitle: 'childrenTitle',
		childrenPath: 'childrenPath',
		title: 'title',
		secondLang: true,
		langSuffix: 'Lg1',
	} as unknown as any;

	it('should display children and parent', () => {
		render(
			<Router>
				<RelationsView {...defaultProps} />
			</Router>,
		);

		screen.getByText('Libellé Parent Lg1');
		screen.getByText('Libellé Parent Lg2');
		screen.getByText('Libellé Enfant 1 Lg1');
		screen.getByText('Libellé Enfant 1 Lg2');
		screen.getByText('Libellé Enfant 2 Lg1');
		screen.getByText('Libellé Enfant 2 Lg2');
		screen.getByText('Intitulé');
		screen.getByText('Title');
	});
});
