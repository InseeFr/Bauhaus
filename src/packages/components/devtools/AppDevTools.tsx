import type { TanStackDevtoolsReactPlugin } from "@tanstack/react-devtools";
import { lazy, Suspense } from "react";

import { useAppContext } from "../../application/app-context";
import { DevUserPlugin } from "./DevUserPlugin";

const TanStackDevtools = lazy(() =>
  import("@tanstack/react-devtools").then((module) => ({
    default: module.TanStackDevtools,
  })),
);

interface AppDevToolsProps {
  additionalPlugins?: TanStackDevtoolsReactPlugin[];
}

export const AppDevTools = ({ additionalPlugins = [] }: Readonly<AppDevToolsProps>) => {
  const { properties } = useAppContext();

  if (!properties.enableDevTools) {
    return null;
  }

  const allPlugins: TanStackDevtoolsReactPlugin[] = [
    {
      id: "dev-user",
      name: "Utilisateur",
      render: <DevUserPlugin />,
    },
    ...additionalPlugins,
  ];

  return (
    <Suspense fallback={null}>
      <TanStackDevtools plugins={allPlugins} />
    </Suspense>
  );
};
