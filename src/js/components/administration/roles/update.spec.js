import React from 'react';
import { shallow } from 'enzyme';
import Update from './update';

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
});
