import React from 'react';
import { storiesOf } from '@storybook/react';
import PageSubtitle from '.';
import './page-subtitle.scss';

import { withKnobs, text } from '@storybook/addon-knobs';

const stories = storiesOf('PageSubtitle', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => <div className="col-md-12">{storyFn()}</div>;
stories.addDecorator(styleDecorator);

stories.add('Default', () => (
	<PageSubtitle subTitle={text('Sub-title', 'Sub-title')} />
));

stories.add('With all props', () => (
	<PageSubtitle subTitle={text('Sub-title', 'Sub-title')} />
));
