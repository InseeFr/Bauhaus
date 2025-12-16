import { useCallback } from "react";

import { PublishButton } from "../buttons/buttons-with-icons";

interface ValidationButtonTypes {
  object: {
    validationState?: string;
  };
  callback: (value: { validationState?: string }) => void;
  disabled?: boolean;
}
export const ValidationButton = ({
  object = {},
  callback,
  disabled = false,
}: ValidationButtonTypes) => {
  const state = object.validationState || "";

  const clickHandler = useCallback(() => {
    callback(object);
  }, [object, callback]);

  if (state.includes("Validated")) {
    return null;
  }
  return <PublishButton action={clickHandler} disabled={disabled} />;
};
