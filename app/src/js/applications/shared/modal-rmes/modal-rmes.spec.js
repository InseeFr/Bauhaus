import React from 'react';
import { shallow } from 'enzyme';
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
		shallow(
			<ModalRmes
				id="id"
				isOpen={true}
				title="title"
				closeCancel={onClick}
				modalButtons={modalButtons}
			/>
		);
	});

	it('returns footer buttons', () => {
		const wrapper = shallow(
			<ModalRmes
				id="id"
				isOpen={true}
				title="title"
				closeCancel={onClick}
				modalButtons={modalButtons}
			/>
		);
		expect(
			wrapper.find('.modal-footer').containsMatchingElement(
				<div className="centered">
					<button>primary</button>
					<button>default</button>
				</div>
			)
		).toEqual(true);
	});
});
