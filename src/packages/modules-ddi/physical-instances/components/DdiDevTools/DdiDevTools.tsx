import { AppDevTools } from "../../../../components/devtools/AppDevTools";
import { Ddi4Plugin } from "./Ddi4Plugin";
import { Ddi4LangsPlugin } from "./Ddi4LangsPlugin";
import type { PhysicalInstanceResponse } from "../../types/api";

interface DdiDevToolsProps {
  data: unknown;
  dataByLangs: Map<string, PhysicalInstanceResponse>;
}

export const DdiDevTools = ({ data, dataByLangs }: Readonly<DdiDevToolsProps>) => {
  return (
    <AppDevTools
      additionalPlugins={[
        {
          id: "ddi4-inspector",
          name: "DDI4 Inspector",
          render: <Ddi4Plugin data={data} />,
        },
        {
          id: "ddi4-langs-inspector",
          name: "DDI4 By Language",
          render: <Ddi4LangsPlugin dataByLangs={dataByLangs} />,
        },
      ]}
    />
  );
};
