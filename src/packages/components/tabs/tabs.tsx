import { TabView, TabPanel } from "primereact/tabview";
import { ReactNode } from "react";

import { Panel } from "../panel";

export const Tabs = ({
  tabs,
}: {
  tabs: { title: string; disabled?: boolean; content: ReactNode }[];
}) => {
  return (
    <TabView>
      {tabs.map((t) => (
        <TabPanel key="title" header={t.title} disabled={t.disabled}>
          <Panel>{t.content}</Panel>
        </TabPanel>
      ))}
    </TabView>
  );
};
