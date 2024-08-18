import { render } from '@testing-library/react';
import { ModalRmes } from './modal-rmes';

const modalButtons = [
	{
		label: 'primary',
		action: jest.fn(),
		style: 'primary',
	},
	{
		label: 'default',
		action: jest.fn(),
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
				closeCancel={jest.fn()}
				modalButtons={modalButtons}
			/>
		);
	});
});
