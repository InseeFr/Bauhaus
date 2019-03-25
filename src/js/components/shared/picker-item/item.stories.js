import React from 'react';
import { storiesOf } from '@storybook/react';
import PickerItem from './';
import addLogo from 'js/components/shared/logo/logo-add';
import delLogo from 'js/components/shared/logo/logo-del';

import { withKnobs, text } from '@storybook/addon-knobs';

const stories = storiesOf('Picker-Item', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => <div className="col-md-12">{storyFn()}</div>;
stories.addDecorator(styleDecorator);

stories.add('Add', () => (
	<PickerItem
		id="id"
		label={text('Label', 'label')}
		logo={addLogo}
		handleClick={() => console.log('action')}
	/>
));

stories.add('Delete', () => (
	<PickerItem
		id="id"
		label={text('Label', 'label')}
		logo={delLogo}
		handleClick={() => console.log('action')}
	/>
));
