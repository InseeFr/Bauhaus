import React from 'react';
import { storiesOf } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import RmesTree from './';

import { withKnobs } from '@storybook/addon-knobs';

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
		label: 'A',
		children: [
			{
				label: 'AA',
				children: [{ label: 'AA1' }, { label: 'AA2' }],
			},
		],
	},
	{
		label: 'B',
		children: [
			{
				label: 'BB',
				children: [
					{ label: 'BB1' },
					{ label: 'BB2', children: { label: 'BB21' } },
				],
			},
		],
	},
	{
		label: 'C',
	},
];

stories.add('Default', () => <RmesTree treeData={data} linkPath={() => ''} />);
