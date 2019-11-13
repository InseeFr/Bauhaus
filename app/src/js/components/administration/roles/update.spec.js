import React from 'react';
import { shallow } from 'enzyme';
import Update from './update';
import { Button } from 'bauhaus-library';
import { SelectRmes } from 'bauhaus-library';

const roles = [{ id: 'id', label: 'label', persons: [] }];

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
		const container = shallow(
			<Update
				roles={roles}
				agents={[]}
				handleSave={() => console.log('save')}
			/>
		);

		expect(container.find(SelectRmes).props().options).toEqual([
			{ value: 'id', label: 'label' },
		]);
	});

	it('should set the disabled property to true if there is nothing to add / delete', () => {
		const container = shallow(
			<Update
				roles={roles}
				agents={[]}
				handleSave={() => console.log('save')}
			/>
		);

		expect(container.find(Button).get(1).props.disabled).toBeTruthy();
	});

	it('should set the disabled property to false ig there is something to add and/or delete', () => {
		const container = shallow(
			<Update
				roles={roles}
				agents={[]}
				handleSave={() => console.log('save')}
			/>
		);

		container.setState({
			toAdd: {
				'1': '1',
			},
		});

		expect(container.find(Button).get(1).props.disabled).toBeFalsy();
	});
});
