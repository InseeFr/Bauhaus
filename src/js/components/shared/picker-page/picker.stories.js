import React from 'react';
import { MemoryRouter } from 'react-router';
import { storiesOf } from '@storybook/react';
import Picker from './';

import { withKnobs, text } from '@storybook/addon-knobs';

const stories = storiesOf('Picker-Page', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => <div className="col-md-12">{storyFn()}</div>;
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
		title={text('Title', 'Title')}
		panelTitle={text('Panel title', 'Panel title')}
		labelWarning={text('Warning', 'Warning')}
		labelValidateButton={text('Button label', 'Valid')}
		handleAction={() => console.log('action')}
		context="concepts"
	/>
));
