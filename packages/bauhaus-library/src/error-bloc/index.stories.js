import React from 'react';
import { storiesOf } from '@storybook/react';

import ErrorBloc from './';

const stories = storiesOf('ErrorBloc', module);

stories.add('Default', () => <ErrorBloc error="'This is an error'" />);
