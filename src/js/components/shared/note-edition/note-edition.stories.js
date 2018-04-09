import React from 'react';
import { storiesOf } from '@storybook/react';
import NoteEdition from './';

import { withKnobs, text, object } from '@storybook/addon-knobs/react';

const stories = storiesOf('NoteEdition', module);
stories.addDecorator(withKnobs);

const styleDecorator = storyFn => <div className="col-md-12">{storyFn()}</div>;
stories.addDecorator(styleDecorator);

const html = `
	<div>
		<p>PanelHtml body</p>
		<p>
			<ul>
				<li>Item 1</li>
				<li>Item 2</li>
			</ul>
		</p>
	</div>`;
const langs = { lg1: 'fr', lg2: 'en' };

stories.add('Default', () => (
	<NoteEdition
		noteLg1={text('Note lang 1', html)}
		noteLg2={text('Note lang 2', '')}
		langs={object('Langs', langs)}
	/>
));
