import { AppDevTools } from "../../../../components/devtools/AppDevTools";
import { Ddi4Plugin } from "./Ddi4Plugin";

interface DdiDevToolsProps {
  data: unknown;
}

export const DdiDevTools = ({ data }: Readonly<DdiDevToolsProps>) => {
  return (
    <AppDevTools
      additionalPlugins={[
        {
          id: "ddi4-inspector",
          name: "DDI4 Inspector",
          render: <Ddi4Plugin data={data} />,
        },
      ]}
    />
  );
};
