import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

import { renderMarkdownElement } from "@utils/html-utils";

import "./SimsFieldInstructions.css";

interface SimsFieldInstructionsTypes {
  msd: { instructionLg1?: string; instructionLg2?: string };
  secondLang?: boolean;
}

/**
 * Instructions de remplissage d'une rubrique (`dcterms:instructionalMethod` du modèle SIMS),
 * repliées par défaut. Rien n'est rendu quand la rubrique n'en a pas.
 */
export const SimsFieldInstructions = ({
  msd,
  secondLang,
}: Readonly<SimsFieldInstructionsTypes>) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  const instruction = (secondLang && msd.instructionLg2) || msd.instructionLg1;
  if (!instruction) {
    return null;
  }

  const label = t(expanded ? "sims.hideInstructions" : "sims.showInstructions");

  return (
    <div className="sims-field-instructions">
      <button
        type="button"
        className="sims-field-instructions__toggle"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((value) => !value)}
      >
        <span className="pi pi-info-circle" aria-hidden="true" />
        {label}
        <span className="pi pi-chevron-down sims-field-instructions__chevron" aria-hidden="true" />
      </button>
      {expanded && (
        <div id={panelId} className="sims-field-instructions__content">
          <span className="pi pi-lightbulb sims-field-instructions__icon" aria-hidden="true" />
          <div>
            <p className="sims-field-instructions__title">{t("sims.instructionsTitle")}</p>
            {renderMarkdownElement(instruction)}
          </div>
        </div>
      )}
    </div>
  );
};
