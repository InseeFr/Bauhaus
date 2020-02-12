import React from 'react';
import { storiesOf } from '@storybook/react';
import PickerItem from '.';
import AddLogo from '../logo/logo-add';
import DelLogo from '../logo/logo-del';

import { withKnobs, text } from '@storybook/addon-knobs';

const stories = storiesOf('Picker-Item', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => <div className="col-md-12">{storyFn()}</div>;
stories.addDecorator(styleDecorator);

stories.add('Add', () => (
	<PickerItem
		id="id"
		label={text('Label', 'label')}
		logo={AddLogo}
		handleClick={() => console.log('action')}
	/>
));

stories.add('Delete', () => (
	<PickerItem
		id="id"
		label={text('Label', 'label')}
		logo={DelLogo}
		handleClick={() => console.log('action')}
	/>
));
