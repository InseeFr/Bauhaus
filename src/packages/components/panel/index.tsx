import { PropsWithChildren, ReactNode, useId } from "react";

import { Card } from "@components/ui/card";
import { Panel as PrimePanel, PanelHeaderTemplateOptions } from "@components/ui/panel";

import "./index.css";

export const Panel = ({ title, children }: Readonly<PropsWithChildren<{ title?: ReactNode }>>) => {
  const titleId = useId();

  if (!title) {
    return <Card className="bauhaus-panel">{children}</Card>;
  }

  const headerTemplate = (options: PanelHeaderTemplateOptions) => (
    <div className={options.className}>
      <h3 id={titleId} className={options.titleClassName}>
        {title}
      </h3>
    </div>
  );

  return (
    <PrimePanel
      className="bauhaus-panel"
      headerTemplate={headerTemplate}
      pt={{ toggleableContent: { "aria-labelledby": titleId } }}
    >
      {children}
    </PrimePanel>
  );
};
