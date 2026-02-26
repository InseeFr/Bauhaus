import { lazy, Suspense } from "react";
import { useAppContext } from "../../../../application/app-context";
import { Ddi4Plugin } from "./Ddi4Plugin";

const TanStackDevtools = lazy(() =>
  import("@tanstack/react-devtools").then((module) => ({
    default: module.TanStackDevtools,
  })),
);

interface DdiDevToolsProps {
  data: unknown;
}

export const DdiDevTools = ({ data }: Readonly<DdiDevToolsProps>) => {
  const { properties } = useAppContext();

  if (!properties.enableDevTools) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <TanStackDevtools
        plugins={[
          {
            id: "ddi4-inspector",
            name: "DDI4 Inspector",
            render: <Ddi4Plugin data={data} />,
          },
        ]}
      />
    </Suspense>
  );
};
