import React from 'react';
import { render } from '@testing-library/react';
import Modal from './modal-rmes';

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
			<Modal
				id="id"
				isOpen={true}
				title="title"
				closeCancel={onClick}
				modalButtons={modalButtons}
			/>
		);
	});
});
