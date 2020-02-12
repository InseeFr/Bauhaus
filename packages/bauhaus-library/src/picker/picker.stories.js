import React from 'react';
import { MemoryRouter } from 'react-router';
import { storiesOf } from '@storybook/react';
import Picker from '.';

import { withKnobs, text } from '@storybook/addon-knobs';

const stories = storiesOf('Picker', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => (
	<div className="col-md-10 col-md-offset-1">{storyFn()}</div>
);
stories.addDecorator(styleDecorator);

const storeDecorator = story => (
	<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
);
stories.addDecorator(storeDecorator);

const items = Array(99)
	.fill()
	.map((a, i) => ({ id: `${i}`, label: `Item ${i + 1}` }));

stories.add('Default', () => (
	<Picker
		items={items}
		panelTitle={text('Panel title', 'Panel title')}
		context="concepts"
	/>
));
