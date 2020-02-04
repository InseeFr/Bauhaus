import { configure } from "@storybook/react";
import "bootstrap/dist/css/bootstrap.css";
import "app.scss";

const requireAll = requireContext => requireContext.keys().map(requireContext);

const loadStories = () =>
  requireAll(require.context("js/components", true, /stories\.jsx?$/));

configure(loadStories, module);
