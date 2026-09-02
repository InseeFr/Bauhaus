import { ComponentProps } from "react";

import D, { D2 } from "../../i18n";
import { OrganizationInput, StampsInput } from "../stamps-input/stamps-input";

type CreatorsInputProps = Readonly<
  Omit<ComponentProps<typeof StampsInput>, "labelSingle" | "labelMulti" | "lang"> & {
    lang?: "first" | "default";
    mode?: "stamp" | "organization";
  }
>;

export const CreatorsInput = ({ lang = "first", mode = "stamp", ...props }: CreatorsInputProps) => {
  const Dictionary = lang === "first" ? D : D2;

  if (mode === "organization") {
    return (
      <OrganizationInput
        labelSingle={Dictionary.creatorsInput.creatorTitle}
        labelMulti={Dictionary.creatorsInput.creatorsTitle}
        lang={lang}
        {...props}
      />
    );
  }

  return (
    <StampsInput
      labelSingle={Dictionary.creatorsInput.creatorTitle}
      labelMulti={Dictionary.creatorsInput.creatorsTitle}
      lang={lang}
      {...props}
    />
  );
};
