import React from 'react';
import { shallow } from 'enzyme';
import NoteFlag from './note-flag';

describe('note-flag', () => {
	it('renders without crashing', () => {
		const flag = shallow(<NoteFlag text="text" lang="en" />);
		const html = flag.html();
		expect(html.includes('text')).toBeTruthy();
		expect(html.includes('en.png')).toBeTruthy();
	});
});
