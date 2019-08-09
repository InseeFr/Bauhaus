import React from 'react';
import { shallow } from 'enzyme';
import EditorHtml from '.';

describe('editor-html', () => {
	it('renders without crashing', () => {
		const onChange = () => '';
		shallow(<EditorHtml text="text" handleChange={onChange} smart={true} />);
	});
});
