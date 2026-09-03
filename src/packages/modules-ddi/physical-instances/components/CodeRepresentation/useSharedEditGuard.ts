import { useCallback, useRef, useState } from "react";

import type {
  Category,
  CategoryUsage,
  CodeList,
  CodeListUsage,
  CodeRepresentation as CodeRepresentationType,
} from "../../types/api";
import { useFetchCategoryUsers } from "../../../hooks/useCategoryUsers";
import { useFetchCodeListUsers } from "../../../hooks/useCodeListUsers";
import type { CodeTableRow } from "./CodeListDataTable";
import {
  createCategoryVariant,
  createCodeListVariant,
  createDefaultRepresentation,
  isCategorySharedWithOtherLists,
  isCodeListSharedWithOthers,
} from "./CodeRepresentation.utils";
import type { OverrideDialogCase } from "./overrideDialogTexts";

/**
 * Applique une édition. Chaque handler construit son résultat et le remet au commit choisi par la
 * garde — écraser l'élément partagé ({@code onChange} tel quel) ou créer une variante.
 */
export type CommitEdit = (
  representation: CodeRepresentationType | undefined,
  codeList?: CodeList,
  categories?: Category[],
) => void;

/** Une édition en attente : le handler, prêt à être rejoué avec le commit choisi. */
export type ApplyEdit = (commit: CommitEdit) => void;

export interface SharedEditDialogState {
  dialogCase: OverrideDialogCase;
  listUsages: CodeListUsage[];
  categoryUsages: CategoryUsage[];
  categoryLabel?: string;
  onCancel: () => void;
  onVariant: () => void;
  onConfirm: () => void;
}

export interface UseSharedEditGuardParams {
  /** Liste mutualisée : aucune édition possible, donc aucune garde. */
  readOnly: boolean;
  /** Liste de codes dont on interroge les usages (référencée ou en cours de sélection). */
  codeListUsersAgency?: string;
  codeListUsersId?: string;
  /** Identifiant de la liste attachée à la variable, pour juger du partage d'une catégorie. */
  referencedCodeListId?: string;
  currentVariableId?: string;
  categories: Category[];
  defaultAgencyId: string;
  /** Usages de la liste tels que connus au rendu, utilisés en repli si le fetch échoue. */
  renderedCodeListUsages: CodeListUsage[];
  onChange: CommitEdit;
  /** Rattache la ligne éditée à la variante de catégorie fraîchement créée. */
  onCategoryReplaced: (rowId: string, categoryId: string) => void;
}

/**
 * Garde les éditions d'une liste de codes partagée et/ou d'une catégorie partagée : décide s'il
 * faut confirmer, et avec quelle déclinaison de popup, puis applique l'édition selon le choix.
 *
 * Deux entrées : {@link withOverrideGuard} pour toute mutation de la liste, et
 * {@link withCategoryOverrideGuard} pour l'édition du libellé d'un code — qui est en réalité
 * l'édition de sa catégorie, laquelle peut être réutilisée par d'AUTRES listes.
 */
export const useSharedEditGuard = ({
  readOnly,
  codeListUsersAgency,
  codeListUsersId,
  referencedCodeListId,
  currentVariableId,
  categories,
  defaultAgencyId,
  renderedCodeListUsages,
  onChange,
  onCategoryReplaced,
}: UseSharedEditGuardParams) => {
  // Vrai une fois que l'utilisateur a confirmé « Modifier la liste partagée » : la confirmation
  // ne s'affiche qu'une seule fois par session d'édition d'une liste donnée.
  const overrideAcknowledgedRef = useRef(false);
  // IDs des catégories dont la modification partagée a déjà été confirmée : la confirmation
  // « catégorie partagée » ne s'affiche qu'une fois par catégorie et par session d'édition.
  const categoryAcknowledgedRef = useRef<Set<string>>(new Set());
  const [dialog, setDialog] = useState<SharedEditDialogState | null>(null);

  const fetchCodeListUsers = useFetchCodeListUsers();
  const fetchCategoryUsers = useFetchCategoryUsers();

  /** On change de liste/variable : les confirmations de surcharge pourront réapparaître. */
  const resetAcknowledgements = useCallback(() => {
    overrideAcknowledgedRef.current = false;
    categoryAcknowledgedRef.current = new Set();
  }, []);

  const closeDialog = () => setDialog(null);

  /**
   * Ouvre la popup et n'a fini qu'une fois l'utilisateur décidé. Résout à `true` : l'appelant
   * sait ainsi qu'il a été interrompu, et peut par exemple rendre le focus au champ édité.
   */
  const askUser = (
    state: Omit<SharedEditDialogState, "onCancel" | "onVariant" | "onConfirm">,
    actions: { onCancel: () => void; onVariant: () => void; onConfirm: () => void },
  ): Promise<boolean> =>
    new Promise((resolve) => {
      const choose = (action: () => void) => () => {
        closeDialog();
        action();
        resolve(true);
      };
      setDialog({
        ...state,
        onCancel: choose(actions.onCancel),
        onVariant: choose(actions.onVariant),
        onConfirm: choose(actions.onConfirm),
      });
    });

  /**
   * Usages de la liste résolus au moment de l'édition. La valeur du rendu peut être encore vide
   * juste après l'ouverture — décider avec elle appliquerait la 1re frappe sans confirmation. On
   * interroge donc le cache TanStack (instantané une fois la requête du panneau résolue) et on
   * attend le réseau sinon ; en cas d'échec, on retombe sur le rendu.
   */
  const resolveListSharing = async (): Promise<{ usages: CodeListUsage[]; shared: boolean }> => {
    if (!codeListUsersAgency || !codeListUsersId) {
      return { usages: [], shared: false };
    }
    const usages = await fetchCodeListUsers(codeListUsersAgency, codeListUsersId).catch(
      () => renderedCodeListUsages,
    );
    return { usages, shared: isCodeListSharedWithOthers(usages, currentVariableId) };
  };

  const commitAsVariant: CommitEdit = (representation, editedCodeList, editedCategories) => {
    if (!editedCodeList) {
      onChange(representation, editedCodeList, editedCategories);
      return;
    }
    const variant = createCodeListVariant(editedCodeList, defaultAgencyId);
    onChange(
      createDefaultRepresentation(variant.ID, variant.Agency ?? defaultAgencyId),
      variant,
      editedCategories,
    );
  };

  /**
   * Commit « Créer une variante » pour l'édition d'une catégorie : la catégorie éditée est forkée
   * (nouvel item + BasedOn vers l'originale) et le code de la ligne pointe désormais sur elle, si
   * bien que les autres listes qui partageaient la catégorie ne sont pas impactées. Quand la liste
   * est elle aussi partagée (cas 2), elle est forkée par-dessus via {@link commitAsVariant}.
   */
  const commitAsCategoryVariant =
    (row: CodeTableRow, alsoForkList: boolean): CommitEdit =>
    (representation, editedCodeList, editedCategories) => {
      const source = editedCategories?.find((cat) => cat.ID === row.categoryId);
      if (!source || !editedCategories || !editedCodeList) {
        onChange(representation, editedCodeList, editedCategories);
        return;
      }
      const variantCategory = createCategoryVariant(source, defaultAgencyId);
      const nextCategories = editedCategories.map((cat) =>
        cat.ID === row.categoryId ? variantCategory : cat,
      );
      const codeList: CodeList = {
        ...editedCodeList,
        Code: editedCodeList.Code?.map((code) =>
          code.CategoryReference?.ID === row.categoryId
            ? {
                ...code,
                CategoryReference: {
                  ...code.CategoryReference,
                  $type: "Category" as const,
                  Agency: variantCategory.Agency,
                  ID: variantCategory.ID,
                  Version: variantCategory.Version,
                  // L'URN de la variante n'existe pas encore : c'est le back qui la synthétise
                  // à partir de l'identité, à l'écriture. Le schéma généré la déclare requise.
                  URN: undefined as unknown as string,
                },
              }
            : code,
        ),
      };
      // La ligne du tableau doit cibler la variante, sinon la frappe suivante recréerait la
      // catégorie partagée d'origine.
      onCategoryReplaced(row.id, variantCategory.ID);
      // La variante vient d'être créée : elle n'est utilisée par aucune autre liste. On l'acquitte
      // pour que les frappes suivantes s'appliquent directement, sans interroger ses usages.
      categoryAcknowledgedRef.current.add(variantCategory.ID);
      (alsoForkList ? commitAsVariant : onChange)(representation, codeList, nextCategories);
    };

  /**
   * Ce que fait la garde une fois l'utilisateur décidé. `undo` n'est fourni que par les éditions
   * déjà appliquées localement (une frappe dans un champ) : « Annuler » doit alors restaurer la
   * valeur d'avant, là où une action ponctuelle (supprimer, déplacer) n'a simplement rien fait.
   */
  interface GuardOptions {
    undo?: () => void;
    /**
     * Libellé sous lequel citer la catégorie. C'est celui d'AVANT l'édition : la modification
     * étant déjà appliquée localement, celui de la ligne est le nouveau — or c'est bien sous son
     * ancien nom que les autres listes la connaissent.
     */
    categoryLabel?: string;
  }

  /** Popup « liste partagée » (cas 1), commune à la garde liste et au repli de la garde catégorie. */
  const openListDialog = (apply: ApplyEdit, listUsages: CodeListUsage[], options: GuardOptions) =>
    askUser(
      { dialogCase: "list", listUsages, categoryUsages: [] },
      {
        onCancel: () => options.undo?.(),
        onConfirm: () => {
          overrideAcknowledgedRef.current = true;
          apply(onChange);
        },
        onVariant: () => apply(commitAsVariant),
      },
    );

  /**
   * Garde toute mutation de la liste : si la liste est partagée par d'autres variables (et
   * éditable), on demande confirmation avant d'appliquer le changement (cas 1). « Modifier »
   * applique sur la liste partagée et mémorise l'accord pour le reste de la session ; « Créer »
   * applique sur une variante ; « Annuler » restaure l'état d'avant.
   *
   * Résout à `true` si une popup a été affichée.
   */
  const withOverrideGuard = async (apply: ApplyEdit, options: GuardOptions = {}) => {
    if (readOnly || overrideAcknowledgedRef.current) {
      apply(onChange);
      return false;
    }
    const listSharing = await resolveListSharing();
    if (!listSharing.shared) {
      apply(onChange);
      return false;
    }
    return openListDialog(apply, listSharing.usages, options);
  };

  /**
   * Garde l'édition du libellé d'une catégorie : en plus du partage de la liste, la catégorie
   * elle-même peut être réutilisée par d'autres listes de codes. Les usages sont récupérés à la
   * demande (et mis en cache) ; si ceux de la catégorie sont inaccessibles ou vides (catégorie
   * jamais sauvegardée), seule la liste compte.
   */
  const withCategoryOverrideGuard = async (
    row: CodeTableRow,
    apply: ApplyEdit,
    options: GuardOptions = {},
  ): Promise<boolean> => {
    const categoryId = row.categoryId;
    const needsCategoryConfirm =
      !readOnly && Boolean(categoryId) && !categoryAcknowledgedRef.current.has(categoryId);
    if (!needsCategoryConfirm) {
      return withOverrideGuard(apply, options);
    }

    const categoryAgency = categories.find((cat) => cat.ID === categoryId)?.Agency;
    const [listSharing, categoryUsages] = await Promise.all([
      resolveListSharing(),
      fetchCategoryUsers(categoryAgency ?? defaultAgencyId, categoryId).catch(
        (): CategoryUsage[] | null => null,
      ),
    ]);

    if (!categoryUsages || categoryUsages.length === 0) {
      if (listSharing.shared) {
        return openListDialog(apply, listSharing.usages, options);
      }
      apply(onChange);
      return false;
    }

    const categoryShared = isCategorySharedWithOtherLists(categoryUsages, referencedCodeListId);
    // Liste partagée → cas 2 (éléments partagés), même si la catégorie n'est utilisée que par
    // cette liste : une variante de la liste seule laisserait la catégorie partagée entre
    // l'originale et la variante. Liste propre + catégorie partagée → cas 3.
    if (!listSharing.shared && !categoryShared) {
      // Cas 4 : aucun partage, application directe.
      apply(onChange);
      return false;
    }

    return askUser(
      {
        dialogCase: listSharing.shared ? "listAndCategory" : "category",
        listUsages: listSharing.usages,
        categoryUsages,
        categoryLabel: options.categoryLabel ?? row.label,
      },
      {
        onCancel: () => options.undo?.(),
        onConfirm: () => {
          categoryAcknowledgedRef.current.add(categoryId);
          if (listSharing.shared) {
            overrideAcknowledgedRef.current = true;
          }
          apply(onChange);
        },
        onVariant: () => {
          // La catégorie d'origine reste partagée mais la variable ne la référence plus : on
          // l'acquitte pour ne pas redemander confirmation à chaque frappe suivante.
          categoryAcknowledgedRef.current.add(categoryId);
          apply(commitAsCategoryVariant(row, listSharing.shared));
        },
      },
    );
  };

  return { withOverrideGuard, withCategoryOverrideGuard, resetAcknowledgements, dialog };
};
