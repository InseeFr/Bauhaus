import React from 'react';
import { storiesOf } from '@storybook/react';
import Select from './';

import { withKnobs, text, boolean } from '@storybook/addon-knobs';

const stories = storiesOf('Select', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => (
	<div className="col-md-3" style={{ marginTop: '5%' }}>
		{storyFn()}
	</div>
);
stories.addDecorator(styleDecorator);

const options = Array.apply(null, Array(5)).map((a, i) => ({
	value: `${i + 1}`,
	label: `Option ${i + 1}`,
}));

let value = '';

stories.add('Default', () => (
	<Select
		label={text('Label', 'Label')}
		value={text('Value', value)}
		options={options}
		placeholder={text('Placeholder', 'Placeholder')}
		handleChange={e => (value = e.target)}
		searchable={false}
	/>
));

stories.add('Searchable', () => (
	<Select
		label={text('Label', 'Label')}
		value={text('Value', value)}
		options={options}
		placeholder={text('Placeholder', 'Placeholder')}
		handleChange={e => (value = e.target)}
		searchable={true}
	/>
));

stories.add('Clearable', () => (
	<Select
		label={text('Label', 'Label')}
		value={text('Value', value)}
		options={options}
		placeholder={text('Placeholder', 'Placeholder')}
		handleChange={e => (value = e.target)}
		searchable={false}
		clearable={true}
	/>
));

stories.add('With all props', () => (
	<Select
		label={text('Label', 'Label')}
		value={text('Value', value)}
		options={options}
		placeholder={text('Placeholder', 'Placeholder')}
		handleChange={e => (value = e)}
		searchable={boolean('Searchable', 'true')}
		clearable={boolean('Clearable', 'true')}
		multi={boolean('Multi', 'true')}
	/>
));
