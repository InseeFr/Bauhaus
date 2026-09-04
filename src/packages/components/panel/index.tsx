import { PropsWithChildren, ReactNode } from "react";

import "./index.css";

export const Panel = ({ title, children }: Readonly<PropsWithChildren<{ title?: ReactNode }>>) => {
  if (!title) {
    return (
      <div className="card panel">
        <div className="card-body">{children}</div>
      </div>
    );
  }

  return (
    <div className="card panel">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
};
