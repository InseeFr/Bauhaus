import React from 'react';
import { storiesOf } from '@storybook/react';
import Tabs from './';

const stories = storiesOf('Tabs-Rmes', module);

const styleDecorator = storyFn => <div className="col-md-12">{storyFn()}</div>;
stories.addDecorator(styleDecorator);

const tabs = [
	{ id: 1, title: 'Tab 1', content: <p>Content 1</p> },
	{ id: 2, title: 'Tab 2', content: <p>Content 2</p> },
];

stories.add('Default', () => <Tabs title="My title" tabs={tabs} />);
