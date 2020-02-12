import React from 'react';
import { shallow, mount } from 'enzyme';
import Update from './update';
import { Button, Select } from '@inseefr/wilco';
import { MemoryRouter } from 'react-router-dom';
const roles = [{ id: 'id', label: 'label', persons: [] }];
jest.mock('./utils', () => {
	return {
		buildAgents: jest.fn().mockReturnValue([]),
	};
});
describe('administration-update-roles', () => {
	it('renders without crashing', () => {
		shallow(
			<Update
				roles={roles}
				agents={[]}
				handleSave={() => console.log('save')}
			/>
		);
	});

	it('should set options for the select component', () => {
		const container = mount(
			<MemoryRouter>
				<Update
					roles={roles}
					agents={[]}
					handleSave={() => console.log('save')}
				/>
			</MemoryRouter>
		);

		expect(container.find(Select).props().options).toEqual([
			{ value: 'id', label: 'label' },
		]);
	});

	it('should set the disabled property to true if there is nothing to add / delete', () => {
		const container = mount(
			<MemoryRouter>
				<Update
					roles={roles}
					agents={[]}
					handleSave={() => console.log('save')}
				/>
			</MemoryRouter>
		);

		expect(container.find(Button).get(1).props.disabled).toBeTruthy();
	});
});
