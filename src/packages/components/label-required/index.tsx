import { ComponentProps, PropsWithChildren } from "react";

import "./index.css";

export const LabelRequired = ({
  children,
  ...props
}: Readonly<PropsWithChildren<ComponentProps<"label">>>) => {
  return (
    <label {...props} className="label-required">
      {children}
      <span className="asterisk">*</span>
    </label>
  );
};
