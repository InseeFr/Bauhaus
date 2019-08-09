import React from 'react';
import { shallow } from 'enzyme';
import ModifyNotes from './modify-notes';

const handle = () => console.log('change');

describe('modify-notes', () => {
	it('renders without crashing', () => {
		shallow(<ModifyNotes handleChange={handle} />);
	});
});
