import React from 'react';
import { storiesOf } from '@storybook/react';
import Loading from './';

const stories = storiesOf('Loading', module);

const styleDecorator = storyFn => (
	<div className="col-md-12" style={{ marginTop: '5%' }}>
		{storyFn()}
	</div>
);
stories.addDecorator(styleDecorator);

stories.add('Default - Concepts', () => (
	<Loading textType="loading" context="concepts" />
));

stories.add('Operations', () => (
	<Loading textType="loading" context="operations" />
));

stories.add('Classifications', () => (
	<Loading textType="loading" context="classifications" />
));
