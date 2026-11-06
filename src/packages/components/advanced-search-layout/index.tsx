import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { NumberResults } from "@components/number-results";
import { PageTitle } from "@components/page-title";
import { Button } from "@components/ui/button";

import { componentsI18n } from "../i18n";

interface AdvancedSearchLayoutProps {
  title: string;
  /** La page de liste vers laquelle ramène le bouton de retour. */
  backTo: string;
  /** Libellé du bouton de retour ; « Retour » par défaut. */
  backLabel?: string;
  /** Réinitialise les critères, en général le `reset` de `useUrlQueryParameters`. */
  onReset: () => void;
  /** Actions propres à la page (un export, par exemple), entre le retour et la réinitialisation. */
  actions?: ReactNode;
  /** Les critères de recherche : une ou plusieurs `AdvancedSearchCard`. */
  criteria: ReactNode;
  /** Les résultats filtrés, dont le nombre s'affiche au-dessus de la liste. */
  results: unknown[];
  children: ReactNode;
}

/**
 * Mise en page commune aux pages de recherche avancée : le titre, les boutons de retour et de
 * réinitialisation, les cartes de critères, le nombre de résultats puis la liste des résultats.
 */
export const AdvancedSearchLayout = ({
  title,
  backTo,
  backLabel,
  onReset,
  actions,
  criteria,
  results,
  children,
}: Readonly<AdvancedSearchLayoutProps>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });
  const navigate = useNavigate();

  return (
    <div className="container">
      <PageTitle title={title} />
      <div className="flex justify-content-between mb-3">
        <Button
          icon="pi pi-arrow-left"
          text
          label={backLabel ?? t("btnReturn")}
          onClick={() => navigate(backTo)}
        />
        {actions}
        <Button icon="pi pi-refresh" text label={t("btnReinitialize")} onClick={onReset} />
      </div>
      {criteria}
      <div className="text-center mb-2">
        <NumberResults results={results} />
      </div>
      {children}
    </div>
  );
};
