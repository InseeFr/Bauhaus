import { ComponentProps, PropsWithChildren } from "react";

import { cx } from "@utils/cx";

export const Column = ({ children }: PropsWithChildren<unknown>) => {
  return <div className="col-12 lg:col-6">{children}</div>;
};

export const Row = ({
  children,
  className = "",
  ...props
}: PropsWithChildren<ComponentProps<"div">>) => (
  <div className={cx("grid", className)} {...props}>
    {children}
  </div>
);
