import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabsRmes from './tabs-rmes';

describe('TabsRmes Component', () => {
	const tabsMock = [
		{ title: 'Tab 1', content: 'Content 1', disabled: false },
		{ title: 'Tab 2', content: 'Content 2', disabled: false },
		{ title: 'Tab 3', content: 'Content 3', disabled: true }, // Onglet désactivé pour le test
	];

	it('should render correctly with initial active tab', () => {
		render(<TabsRmes tabs={tabsMock} />);
		expect(screen.getByText('Content 1')).toBeVisible();
	});

	it('should switch tabs on click', () => {
		render(<TabsRmes tabs={tabsMock} />);
		const secondTab = screen.getByRole('tab', { name: 'Tab 2' });
		fireEvent.click(secondTab);
		expect(screen.getByText('Content 2')).toBeVisible();
	});

	it('should not switch to disabled tab', () => {
		render(<TabsRmes tabs={tabsMock} />);
		const disabledTab = screen.getByRole('tab', { name: 'Tab 3' });
		fireEvent.click(disabledTab);
		expect(screen.getByText('Content 1')).toBeVisible();
	});
});
