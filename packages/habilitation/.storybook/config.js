import { configure } from '@storybook/react';
import 'bootstrap/dist/css/bootstrap.css';

import './styles.css';

import '@inseefr/ui/dist/index.css';

const requireAll = requireContext => requireContext.keys().map(requireContext);

const loadStories = () =>
	requireAll(require.context('../src', true, /stories\.jsx?$/));

configure(loadStories, module);
