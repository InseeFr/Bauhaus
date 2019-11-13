import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './';

const stories = storiesOf('Button', module);

stories.add('Default', () => (
	<Button label="Click me" action={() => console.log('Click')} />
));

stories.add('Disabled', () => (
	<Button
		label="Click me"
		action={() => console.log('Click')}
		disabled={true}
	/>
));

stories.add('Using children', () => (
	<Button action={() => console.log('Click')}>Click me</Button>
));
