import { ComponentPropsWithoutRef, PropsWithChildren, ReactNode } from "react";

import { ExternalLink, Link } from "../link";
import { Button as PrimeButton } from "../ui/button";
import "./button.css";

const DEFAULT_CLASSES: string[] = [];

type ButtonTypes = {
  action?: string | VoidFunction;
  label?: ReactNode;
  disabled?: boolean;
  wrapper?: boolean;
  classes?: string[];
  externalLink?: boolean;
} & ComponentPropsWithoutRef<"button">;

export const Button = ({
  action,
  label,
  disabled,
  children,
  wrapper = true,
  classes = DEFAULT_CLASSES,
  externalLink,
  ...rest
}: Readonly<PropsWithChildren<ButtonTypes>>) => {
  const content = label || children;

  // Un lien ne peut pas contenir de <button> : il reçoit les classes du bouton PrimeReact.
  const linkClassName = ["p-button", "p-component", "bauhaus-btn", ...classes].join(" ");

  let button;
  if (typeof action === "string") {
    if (externalLink) {
      button = (
        <ExternalLink className={linkClassName} href={action}>
          {content}
        </ExternalLink>
      );
    } else {
      button = (
        <Link className={linkClassName} to={action} disabled={disabled}>
          {content}
        </Link>
      );
    }
  } else {
    //if action is a function, it means a handler was passed in instead of an URL
    button = (
      <PrimeButton
        type="button"
        className={["bauhaus-btn", ...classes].join(" ")}
        onClick={action}
        disabled={disabled}
        {...rest}
      >
        {content}
      </PrimeButton>
    );
  }

  if (!wrapper) {
    return button;
  }

  return button;
};
