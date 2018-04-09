import React from 'react';
import { storiesOf } from '@storybook/react';
import PageTitle from './';
import 'js/components/operations/operations.css';
import 'js/components/classifications/classifications.css';

import { withKnobs, text, number } from '@storybook/addon-knobs/react';

const stories = storiesOf('PageTitle', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => <div className="col-md-12">{storyFn()}</div>;
stories.addDecorator(styleDecorator);

stories.add('Default', () => <PageTitle title={text('Title', 'Title')} />);

stories.add('With all props', () => (
	<PageTitle
		title={text('Title', 'Title')}
		subtitle={text('Sub-Title', '')}
		col={number('Col', 4)}
		offset={text('Offset', '4')}
		context={text('Context', '')}
	/>
));

stories.add('With sub-title', () => (
	<PageTitle
		title={text('Title', 'Title')}
		subtitle={text('Sub-Title', 'Sub-Title')}
	/>
));

stories.add('With operations context', () => (
	<PageTitle title={text('Title', 'Title')} context="operations" />
));
