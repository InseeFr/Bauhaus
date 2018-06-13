import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import InputMulti from './';

import { withKnobs, text } from '@storybook/addon-knobs/react';

const stories = storiesOf('Input multi', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => (
	<div className="col-md-12" style={{ marginTop: '5%' }}>
		{storyFn()}
	</div>
);
stories.addDecorator(styleDecorator);

stories.add('Default', () => (
	<InputMulti
		label={text('Label', 'Label')}
		inputLg1={[]}
		inputLg2={[]}
		handleChangeLg1={action('update lang1')}
		handleChangeLg2={action('update lang2')}
		langs={{ lg1: 'fr', lg2: 'en' }}
	/>
));
