import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './';

import { ThemeContext } from '../context';

const stories = storiesOf('Button', module);

const styleDecorator = storyFn => (
	<div style={{ marginTop: '5%' }}>{storyFn()}</div>
);
stories.addDecorator(styleDecorator);

stories.add('Default', () => (
	<Button label="Click me" action={() => console.log('Click')} />
));

stories.add('Concepts', () => (
	<ThemeContext.Provider value="concepts">
		<Button label="Click me" action={() => console.log('Click')} />
	</ThemeContext.Provider>
));

stories.add('Classifications', () => (
	<ThemeContext.Provider value="classifications">
		<Button label="Click me" action={() => console.log('Click')} />
	</ThemeContext.Provider>
));

stories.add('Operations', () => (
	<ThemeContext.Provider value="operations">
		<Button label="Click me" action={() => console.log('Click')} />
	</ThemeContext.Provider>
));

stories.add('DSDS', () => (
	<ThemeContext.Provider value="dsds">
		<Button label="Click me" action={() => console.log('Click')} />
	</ThemeContext.Provider>
));
