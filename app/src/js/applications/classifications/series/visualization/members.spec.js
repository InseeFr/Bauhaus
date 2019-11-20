import React from 'react';
import { shallow } from 'enzyme';
import Members from './members';

const members = [{ id: '1', label: 'Member 1' }];

describe('classification-series-members', () => {
	it('renders without crashing', () => {
		shallow(<Members members={members} secondLang={true} />);
	});
});
