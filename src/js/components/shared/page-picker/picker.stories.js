import React from 'react';
import { MemoryRouter } from 'react-router';
import { storiesOf } from '@storybook/react';
import Picker from './';

import { withKnobs, text } from '@storybook/addon-knobs/react';

const stories = storiesOf('Picker', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => <div className="col-md-12">{storyFn()}</div>;
stories.addDecorator(styleDecorator);

const storeDecorator = story => (
	<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
);
stories.addDecorator(storeDecorator);

const items = [
	{ id: '1', label: 'Item 1' },
	{ id: '2', label: 'Item 2' },
	{ id: '3', label: 'Item 3' },
];

stories.add('Default', () => (
	<Picker
		items={items}
		title={text('Title', 'Title')}
		panelTitle={text('Panel title', 'Panel title')}
		labelWarning={text('Warning', 'Warning')}
		labelValidateButton={text('Button label', 'Valid')}
		handleAction={() => console.log('action')}
		context="concepts"
	/>
));
