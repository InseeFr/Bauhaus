import React from 'react';
import { storiesOf } from '@storybook/react';
import Panel from './';
import './panel.scss';

import { withKnobs, text } from '@storybook/addon-knobs';

const stories = storiesOf('Panel', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => <div className="col-md-12">{storyFn()}</div>;
stories.addDecorator(styleDecorator);

stories.add('Default', () => (
	<Panel title={text('Title', 'Panel title')}>
		{text('Children', 'Panel body')}
	</Panel>
));
