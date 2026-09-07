import { ComponentProps, PropsWithChildren } from "react";

import "./index.css";
import { cx } from "@utils/cx";

export const Column = ({ children }: PropsWithChildren<unknown>) => {
  return <div className="col-md-6">{children}</div>;
};

export const Row = ({
  children,
  className = "",
  ...props
}: PropsWithChildren<ComponentProps<"div">>) => (
  <div className={cx("row", className)} {...props}>
    {children}
  </div>
);
