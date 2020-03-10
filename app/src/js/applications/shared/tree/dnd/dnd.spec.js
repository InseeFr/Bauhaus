import React from 'react';
import { render } from '@testing-library/react';
import DND from './';

describe('tree-dnd', () => {
	it('renders without crashing', () => {
		render(<DND treeData={[]} linkPath={l => l} />);
	});
});
