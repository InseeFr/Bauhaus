import React from 'react';
import { render } from '@testing-library/react';
import EditorHtml from '.';

describe('editor-html', () => {
	it('renders without crashing', () => {
		const onChange = () => '';
		render(<EditorHtml text="text" handleChange={onChange} smart={true} />);
	});
});
