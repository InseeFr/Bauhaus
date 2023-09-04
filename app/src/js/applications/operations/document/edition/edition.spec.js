import { render, screen } from '@testing-library/react';
import { ConfirmationModal } from './edition';

describe('ConfirmationModal', () => {
	it('should display two confirmation buttons', async () => {
		render(<ConfirmationModal isOpen={true} document={{ sims: [] }} onNo={() => {}} onYes={() => {}}/>)
		await screen.findByText("Yes")
		await screen.findByText("No")
	});
	it('should display the warning for document', async () => {
		render(<ConfirmationModal isOpen={true} document={{ url: '/document/', sims: [] }} onNo={() => {}} onYes={() => {}}/>);
		await screen.findByText("This document is already used by the following sims")
	});
})
