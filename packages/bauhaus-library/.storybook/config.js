import { configure, addDecorator } from '@storybook/react';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import './styles.css';

const requireAll = requireContext => requireContext.keys().map(requireContext);

const loadStories = () =>
	requireAll(require.context('../src', true, /stories\.jsx?$/));

configure(loadStories, module);
