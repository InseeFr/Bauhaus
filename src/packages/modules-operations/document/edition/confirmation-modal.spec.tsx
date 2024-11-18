import { render, screen } from '@testing-library/react';

import { ConfirmationModal } from './confirmation-modal';

describe('ConfirmationModal', () => {
	it('should display two confirmation buttons', async () => {
		render(
			<ConfirmationModal
				isOpen={true}
				document={{ sims: [] }}
				onNo={() => {}}
				onYes={() => {}}
			/>,
		);
		await screen.findByText('Yes');
		await screen.findByText('No');
	});
});
