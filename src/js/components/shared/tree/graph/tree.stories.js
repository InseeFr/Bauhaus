import React from 'react';
import { storiesOf } from '@storybook/react';
import Tree from './';

import { withKnobs } from '@storybook/addon-knobs/react';

const stories = storiesOf('Tree - Graph', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => (
	<div className="col-md-12" style={{ marginTop: '5%' }}>
		{storyFn()}
	</div>
);
stories.addDecorator(styleDecorator);

const data = [
	{
		name: 'My Tree',
		children: [
			{
				name: 'A',
				children: [
					{
						name: 'AA',
						children: [{ name: 'AA1' }, { name: 'AA2' }],
					},
				],
			},
			{
				name: 'B',
				children: [
					{
						name: 'BB',
						children: [
							{ name: 'BB1' },
							{ name: 'BB2', children: { name: 'BB21' } },
						],
					},
				],
			},
			{
				name: 'C',
			},
		],
	},
];

stories.add('Default', () => <Tree data={data} orientation={'vertical'} />);

stories.add('Horizontal', () => (
	<Tree data={data} orientation={'horizontal'} />
));

stories.add('Initial depth', () => (
	<Tree data={data} orientation={'horizontal'} initialDepth={1} />
));
