import { render } from '@testing-library/react';

import { ModalButton, ModalRmes } from './modal-rmes';

const modalButtons: ModalButton[] = [
	{
		label: 'primary',
		action: vi.fn(),
		style: 'primary',
		disabled: false,
	},
	{
		label: 'default',
		action: vi.fn(),
		style: 'default',
		disabled: false,
	},
];

describe('modal', () => {
	it('renders without crashing', () => {
		render(
			<ModalRmes
				id="id"
				isOpen={true}
				title="title"
				closeCancel={vi.fn()}
				modalButtons={modalButtons}
			/>,
		);
	});
});
