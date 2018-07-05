import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './';

const stories = storiesOf('Button', module);

const styleDecorator = storyFn => (
	<div style={{ marginTop: '5%' }}>{storyFn()}</div>
);
stories.addDecorator(styleDecorator);

stories.add('Default', () => (
	<Button label="Click me" action={() => console.log('Click')} />
));

stories.add('Concepts', () => (
	<Button
		label="Click me"
		action={() => console.log('Click')}
		context="concepts"
	/>
));

stories.add('Classifications', () => (
	<Button
		label="Click me"
		action={() => console.log('Click')}
		context="classifications"
	/>
));

stories.add('Operations', () => (
	<Button
		label="Click me"
		action={() => console.log('Click')}
		context="operations"
	/>
));
