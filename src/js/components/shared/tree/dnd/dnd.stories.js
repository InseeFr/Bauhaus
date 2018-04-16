import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import RmesTree from './';

import { withKnobs } from '@storybook/addon-knobs/react';

const stories = storiesOf('Tree - DND', module);
stories.addDecorator(withKnobs);

const storeDecorator = story => (
	<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
);
stories.addDecorator(storeDecorator);

const styleDecorator = storyFn => (
	<div className="col-md-12" style={{ marginTop: '5%' }}>
		{storyFn()}
	</div>
);
stories.addDecorator(styleDecorator);

const data = [
	{
		title: 'A',
		children: [
			{
				title: 'AA',
				children: [{ title: 'AA1' }, { title: 'AA2' }],
			},
		],
	},
	{
		title: 'B',
		children: [
			{
				title: 'BB',
				children: [
					{ title: 'BB1' },
					{ title: 'BB2', children: { title: 'BB21' } },
				],
			},
		],
	},
	{
		title: 'C',
	},
];

stories.add('Default', () => <RmesTree treeData={data} />);

stories.add('Drag and Drop', () => <RmesTree treeData={data} canDrag={true} />);
