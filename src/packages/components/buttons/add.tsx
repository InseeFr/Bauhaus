import { ComponentProps } from "react";

import { createAllDictionary } from "@utils/dictionary";

import { AddLogo } from "../logo/logo-add";

const { D } = createAllDictionary({
  add: {
    fr: "Ajouter",
    en: "Add",
  },
});

export const AddButton = (props: Readonly<ComponentProps<"button">>) => {
  return (
    <button {...props} type="button" className="btn btn-default" aria-label={D.add}>
      <AddLogo />
    </button>
  );
};
