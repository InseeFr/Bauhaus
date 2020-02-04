import { configure } from '@storybook/react';
import 'bootstrap/dist/css/bootstrap.css';

const requireAll = requireContext => requireContext.keys().map(requireContext);

const loadStories = () =>
	requireAll(require.context('js/applications', true, /stories\.jsx?$/));

configure(loadStories, module);
