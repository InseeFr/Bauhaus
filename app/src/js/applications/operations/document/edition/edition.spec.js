import { render, screen } from '@testing-library/react';
import OperationsDocumentationEdition, { ConfirmationModal } from './edition';

describe('ConfirmationModal', () => {
	it('should display two confirmation buttons', async () => {
		render(<ConfirmationModal isOpen={true} document={{ sims: [] }} onNo={() => {}} onYes={() => {}}/>)
		await screen.findByText("Yes")
		await screen.findByText("No")
	});
})

describe('OperationsDocumentationEdition', () => {
	it('should render without errors', async () => {
		render(<OperationsDocumentationEdition  document={{ sims: [] }} langOptions={[]} />)
	});
})
