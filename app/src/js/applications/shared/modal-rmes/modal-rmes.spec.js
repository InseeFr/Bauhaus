import React from 'react';
import { render } from '@testing-library/react';
import ModalRmes from './modal-rmes';

const onClick = () => '';
const modalButtons = [
	{
		label: 'primary',
		action: onClick,
		style: 'primary',
	},
	{
		label: 'default',
		action: onClick,
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
				closeCancel={onClick}
				modalButtons={modalButtons}
			/>
		);
	});
});
