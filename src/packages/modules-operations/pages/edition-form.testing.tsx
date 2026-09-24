import { fireEvent, screen } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";

import { AppContextProvider } from "../../application/app-context";
import { operationsI18n } from "../i18n";

/** Contexte complet d'un formulaire d'édition des opérations : i18n réelle, routeur, contexte applicatif. */
export const EditionProviders = ({ children }: PropsWithChildren) => (
  <I18nextProvider i18n={operationsI18n}>
    <MemoryRouter>
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
        {children}
      </AppContextProvider>
    </MemoryRouter>
  </I18nextProvider>
);

// Le libellé est tantôt le parent direct de la liste, tantôt son voisin dans le
// groupe de champs : on retient celui des deux qui la contient.
export const fieldLabelled = (label: string | RegExp) => {
  const node = screen.getByText(label);
  const holder = [node.closest("label"), node.closest(".form-group")].find((el) =>
    el?.querySelector(".p-dropdown, .p-multiselect"),
  )!;
  return holder.querySelector<HTMLElement>(".p-dropdown, .p-multiselect")!;
};

// Une liste PrimeReact s'ouvre au clic sur son champ et pose son panneau en fin
// de document ; le clic suivant hors du panneau le referme.
export const chooseIn = (label: string | RegExp, option: string) => {
  fireEvent.click(fieldLabelled(label));
  const items = screen.getAllByText(option);
  fireEvent.click(items.at(-1)!);
  fireEvent.mouseDown(document.body);
};
