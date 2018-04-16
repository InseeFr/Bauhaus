import React from 'react';
import { shallow } from 'enzyme';
import DND from './';

describe('tree-dnd', () => {
	it('renders without crashing', () => {
		shallow(<DND treeData={[]} linkPath={l => l} />);
	});
});
