import React from 'react';
import { storiesOf } from '@storybook/react';
import { I18NContext } from '../context';

import Loading from '.';
const stories = storiesOf('Loading', module).addDecorator(function(getStory) {
	return (
		<I18NContext.Provider
			value={{
				loadableLoading: 'Loading',
			}}
		>
			{getStory()}
		</I18NContext.Provider>
	);
});

const styleDecorator = storyFn => (
	<div className="col-md-12" style={{ marginTop: '5%' }}>
		{storyFn()}
	</div>
);
stories.addDecorator(styleDecorator);

stories.add('Default', () => <Loading />);
