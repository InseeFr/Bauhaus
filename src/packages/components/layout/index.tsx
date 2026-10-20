import { ComponentProps, PropsWithChildren } from "react";

import "./grid.css";
import "./index.css";
import { cx } from "@utils/cx";

export const Column = ({ children }: PropsWithChildren<unknown>) => {
  return <div className="bauhaus-grid-md-6">{children}</div>;
};

export const Row = ({
  children,
  className = "",
  ...props
}: PropsWithChildren<ComponentProps<"div">>) => (
  <div className={cx("bauhaus-grid-row", className)} {...props}>
    {children}
  </div>
);
