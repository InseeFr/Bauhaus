import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DatePickerRmes from './';

const stories = storiesOf('DatePickerRmes', module);

const styleDecorator = storyFn => (
	<div style={{ marginTop: '5%' }}>{storyFn()}</div>
);
stories.addDecorator(styleDecorator);

stories.add('Default', () => (
	<div className="col-md-4">
		<DatePickerRmes value="" onChange={action('cliked')} placement="bottom" />
	</div>
));

stories.add('Open on right', () => (
	<div className="col-md-4">
		<DatePickerRmes value="" onChange={action('cliked')} placement="right" />
	</div>
));

stories.add('Open on left', () => (
	<div className="col-md-4 col-md-offset-4">
		<DatePickerRmes value="" onChange={action('cliked')} placement="left" />
	</div>
));

stories.add('Open on top', () => (
	<div className="col-md-4" style={{ marginTop: '15%' }}>
		<DatePickerRmes value="" onChange={action('cliked')} placement="top" />
	</div>
));
