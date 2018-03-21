import React from 'react';
import { shallow } from 'enzyme';
import NoteFlag from './note-flag';

describe('note-flag', () => {
	it('renders without crashing', () => {
		shallow(<NoteFlag />);
	});
});
