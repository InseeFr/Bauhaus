import { ComponentProps } from "react";
import D, { D2 } from "../../i18n";
import { OrganisationInput, StampsInput } from "../stamps-input/stamps-input";

type ContributorsInputProps = Readonly<
  Omit<ComponentProps<typeof StampsInput>, "labelSingle" | "labelMulti" | "lang"> & {
    lang?: "first" | "default";
    mode?: "stamp" | "organisation";
  }
>;

export const ContributorsInput = ({
  lang = "first",
  mode = "stamp",
  ...props
}: ContributorsInputProps) => {
  const Dictionnary = lang === "first" ? D : D2;

  if (mode === "organisation") {
    return (
      <OrganisationInput
        labelSingle={Dictionnary.contributors.title}
        labelMulti={Dictionnary.contributors.title}
        lang={lang}
        {...props}
      />
    );
  }

  return (
    <StampsInput
      labelSingle={Dictionnary.contributors.title}
      labelMulti={Dictionnary.contributors.title}
      lang={lang}
      {...props}
    />
  );
};
