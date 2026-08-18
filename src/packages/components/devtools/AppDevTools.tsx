import { lazy, Suspense } from "react";
import type { TanStackDevtoolsReactPlugin } from "@tanstack/react-devtools";
import { useAppContext } from "../../application/app-context";
import { PrivilegesPlugin } from "./PrivilegesPlugin";

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
      id: "privileges-override",
      name: "Privileges",
      render: <PrivilegesPlugin />,
    },
    ...additionalPlugins,
  ];

  return (
    <Suspense fallback={null}>
      <TanStackDevtools plugins={allPlugins} />
    </Suspense>
  );
};
