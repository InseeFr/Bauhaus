import { render } from '@testing-library/react';
import { ModalRmes } from './modal-rmes';

const modalButtons = [
	{
		label: 'primary',
		action: vi.fn(),
		style: 'primary',
	},
	{
		label: 'default',
		action: vi.fn(),
		style: 'default',
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
