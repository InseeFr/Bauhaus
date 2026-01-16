import { PropsWithChildren } from "react";

type ConditionalDisplayTypes = PropsWithChildren<{
  data?: unknown[] | string;
}>;

export const ConditionalDisplay = ({ data, children }: ConditionalDisplayTypes) => {
  if (data === undefined) {
    return null;
  }
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return null;
    }
  }

  if (data === "") {
    return null;
  }

  return <>{children}</>;
};
