import { configure } from '@storybook/react';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import 'css/app.css';

const requireAll = requireContext => requireContext.keys().map(requireContext);

const loadStories = () =>
	requireAll(require.context('js/components', true, /stories\.jsx?$/));

configure(loadStories, module);
