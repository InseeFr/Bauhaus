import { lazy, Suspense, ReactNode } from "react";
import { useAppContext } from "../../application/app-context";
import { PrivilegesPlugin } from "./PrivilegesPlugin";

const TanStackDevtools = lazy(() =>
  import("@tanstack/react-devtools").then((module) => ({
    default: module.TanStackDevtools,
  })),
);

interface DevToolPlugin {
  id: string;
  name: string;
  render: ReactNode;
}

interface AppDevToolsProps {
  additionalPlugins?: DevToolPlugin[];
}

export const AppDevTools = ({ additionalPlugins = [] }: Readonly<AppDevToolsProps>) => {
  const { properties } = useAppContext();

  if (!properties.enableDevTools) {
    return null;
  }

  const allPlugins = [
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
