import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useId } from "react";
import { useTranslation } from "react-i18next";

import { cx } from "@utils/cx";

import type { CategoryUsage, CodeListUsage } from "../../types/api";
import { CategoryUsersPanel } from "./CategoryUsersPanel";
import { otherCodeListNames, otherVariableNames } from "./CodeRepresentation.utils";
import {
  overrideDialogTexts,
  type OverrideDialogCase,
  type OverrideDialogChoice,
} from "./overrideDialogTexts";
import { UsersPanel } from "./UsersPanel";

export interface OverrideDialogProps {
  /** `null` quand aucune édition n'est en attente de confirmation : rien n'est rendu. */
  dialogCase: OverrideDialogCase | null;
  /** Usages de la liste résolus au moment de l'édition (pas la valeur du rendu). */
  listUsages: CodeListUsage[];
  /** Usages de la catégorie (une ligne par liste × variable), pour le compte et le panneau. */
  categoryUsages: CategoryUsage[];
  codeListLabel: string;
  /** Libellé de la catégorie éditée (cas 2 et 3). */
  categoryLabel?: string;
  /** Variable éditée, exclue des impacts annoncés. */
  currentVariableId?: string;
  /** Nom de la variable éditée ; vide en création, d'où le repli sur un libellé générique. */
  currentVariableName?: string;
  /** Liste éditée, exclue des impacts annoncés au niveau de la catégorie. */
  currentCodeListId?: string;
  /** Rien n'est appliqué, la valeur d'avant est restaurée. */
  onCancel: () => void;
  /** La modification est appliquée sur une variante. */
  onVariant: () => void;
  /** La modification est appliquée aux éléments partagés. */
  onConfirm: () => void;
}

interface ChoiceCardProps extends OverrideDialogChoice {
  icon: string;
  variantModifier: "variant" | "overwrite";
  onClick: () => void;
}

/**
 * Une issue possible, cliquable d'un bloc. C'est un vrai bouton : l'intitulé et sa conséquence
 * sont dans la même cible, focalisable et activable au clavier — plutôt qu'une puce descriptive
 * qu'il faudrait mentalement rapprocher d'un bouton de pied de page.
 */
const ChoiceCard = ({
  label,
  description,
  icon,
  variantModifier,
  onClick,
}: Readonly<ChoiceCardProps>) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      className={cx("override-dialog-choice", `override-dialog-choice-${variantModifier}`)}
    >
      <i className={cx("pi", icon)} aria-hidden="true" />
      <span className="override-dialog-choice-text">
        <span className="override-dialog-choice-label">{label}</span>
        <span className="override-dialog-choice-description">{description}</span>
      </span>
    </button>
  </li>
);

/**
 * Confirmation d'une édition portant sur des éléments partagés, dans ses trois déclinaisons
 * (cf. {@link OverrideDialogCase}). Purement présentational : la décision d'ouvrir et les usages
 * viennent de l'appelant ({@code useSharedEditGuard}).
 *
 * Le choix se fait en cliquant l'une des deux issues, chacune annonçant sa conséquence ; le pied
 * de page ne porte donc que « Annuler ». L'issue sans effet sur le travail des autres (créer une
 * variante) est celle mise en avant : la plus lourde de conséquences ne doit pas être celle qui
 * se clique le plus facilement.
 */
export const OverrideDialog = ({
  dialogCase,
  listUsages,
  categoryUsages,
  codeListLabel,
  categoryLabel,
  currentVariableId,
  currentVariableName,
  currentCodeListId,
  onCancel,
  onVariant,
  onConfirm,
}: Readonly<OverrideDialogProps>) => {
  const { t } = useTranslation();
  const contextId = useId();

  if (!dialogCase) {
    return null;
  }

  const texts = overrideDialogTexts(dialogCase, t, {
    codeListLabel,
    otherVariableNames: otherVariableNames(listUsages, currentVariableId),
    categoryLabel,
    otherCodeListNames: otherCodeListNames(categoryUsages, currentCodeListId),
    // En création de variable, le nom n'est pas encore saisi : libellé générique de repli.
    editedVariableName:
      currentVariableName || t("physicalInstance.view.code.override.editedVariable"),
  });

  return (
    <Dialog
      visible
      onHide={onCancel}
      header={texts.title}
      // Largeur figée : déplier le panneau des utilisations ne doit pas élargir la dialog.
      style={{ width: "60rem", maxWidth: "95vw" }}
      className="override-shared-dialog"
      // Sans cela, le scroll du fond décroche les overlays rendus dans la popup.
      blockScroll
      // Ce qui est annoncé au lecteur d'écran après le titre : qui est impacté.
      aria-describedby={contextId}
      footer={
        <div className="flex justify-content-end">
          <Button type="button" label={texts.cancel} text onClick={onCancel} />
        </div>
      }
    >
      <div className="flex flex-column gap-3">
        <div className="override-dialog-context" id={contextId}>
          {texts.contextSentences.map((sentence) => (
            <span key={sentence}>{sentence}</span>
          ))}
          {texts.impactedSummary && (
            <span className="override-dialog-impacted">{texts.impactedSummary}</span>
          )}
        </div>
        <span className="override-dialog-question">{texts.question}</span>
        <ul className="override-dialog-choices">
          <ChoiceCard
            {...texts.variant}
            icon="pi-clone"
            variantModifier="variant"
            onClick={onVariant}
          />
          <ChoiceCard
            {...texts.overwrite}
            icon="pi-pencil"
            variantModifier="overwrite"
            onClick={onConfirm}
          />
        </ul>
        {/* Même bloc « Utilisée par » que dans la page : l'utilisateur peut consulter les
            variables impactées avant de choisir. Sans objet quand seule la catégorie est
            partagée (la liste est propre à la variable). */}
        {dialogCase !== "category" && (
          <UsersPanel
            usages={listUsages}
            currentVariableId={currentVariableId}
            title={t("physicalInstance.view.code.usersPanel.title")}
            help={t("physicalInstance.view.code.usersPanel.help")}
            tooltipTargetId="cl-users-help-override"
          />
        )}
        {/* Second panneau, pour les cas impliquant une catégorie : toutes les listes de codes
            qui utilisent cette catégorie (y compris la courante), en arbre
            Group > StudyUnit > Variable > CodeList. */}
        {dialogCase !== "list" && (
          <CategoryUsersPanel
            usages={categoryUsages}
            title={t("physicalInstance.view.code.categoryUsersPanel.title")}
            help={t("physicalInstance.view.code.categoryUsersPanel.help")}
            tooltipTargetId="cat-users-help-override"
          />
        )}
      </div>
    </Dialog>
  );
};
