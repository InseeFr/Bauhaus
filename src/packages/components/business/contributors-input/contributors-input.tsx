import { ComponentProps } from "react";

import D, { D2 } from "../../i18n";
import { OrganizationInput, StampsInput } from "../stamps-input/stamps-input";

type ContributorsInputProps = Readonly<
  Omit<ComponentProps<typeof StampsInput>, "labelSingle" | "labelMulti" | "lang"> & {
    lang?: "first" | "default";
    mode?: "stamp" | "organization";
  }
>;

export const ContributorsInput = ({
  lang = "first",
  mode = "stamp",
  ...props
}: ContributorsInputProps) => {
  const Dictionary = lang === "first" ? D : D2;

  if (mode === "organization") {
    return (
      <OrganizationInput
        labelSingle={Dictionary.contributors.title}
        labelMulti={Dictionary.contributors.title}
        lang={lang}
        {...props}
      />
    );
  }

  return (
    <StampsInput
      labelSingle={Dictionary.contributors.title}
      labelMulti={Dictionary.contributors.title}
      lang={lang}
      {...props}
    />
  );
};
