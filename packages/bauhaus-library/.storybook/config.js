import { configure } from "@storybook/react";
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";

const requireAll = requireContext => requireContext.keys().map(requireContext);

const loadStories = () =>
  requireAll(require.context("/", true, /stories\.jsx?$/));

configure(loadStories, module);
