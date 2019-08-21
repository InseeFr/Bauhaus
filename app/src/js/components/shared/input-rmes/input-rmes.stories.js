import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Input from './';

import { withKnobs, text } from '@storybook/addon-knobs';

const stories = storiesOf('Input', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => (
	<div className="col-md-3" style={{ marginTop: '5%' }}>
		{storyFn()}
	</div>
);
stories.addDecorator(styleDecorator);

stories.add('Default', () => (
	<Input
		label={text('Label', 'Label')}
		value={text('Value', '')}
		handleChange={action('clicked')}
	/>
));

stories.add('With Fr flag', () => (
	<Input
		label={text('Label', 'My Input')}
		value={text('Value', '')}
		handleChange={action('clicked')}
		lang="fr"
	/>
));
