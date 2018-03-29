import React from 'react';
import { storiesOf } from '@storybook/react';
import PageTitle from './';

import { withKnobs, text } from '@storybook/addon-knobs/react';

const stories = storiesOf('PageTitle', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => <div className="col-md-12">{storyFn()}</div>;
stories.addDecorator(styleDecorator);

stories.add('Default', () => <PageTitle title={text('Title', 'Title')} />);

stories.add('With sub-title', () => (
	<PageTitle
		title={text('Title', 'Title')}
		subtitle={text('Sub-Title', 'Sub-Title')}
	/>
));
