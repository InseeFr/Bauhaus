import { useTranslation } from "react-i18next";

interface SharedCodeListNoticeProps {
  /** Variables, autres que celle éditée, qui utilisent la même liste de codes. */
  otherVariableNames: string[];
}

/** Au-delà, l'énumération est tronquée par un « et N autres ». */
const MAX_LISTED_NAMES = 3;

/**
 * Rappel permanent, au-dessus du tableau, que la liste éditée appartient aussi à d'autres
 * variables.
 *
 * L'acquittement de la popup de confirmation vaut pour toute la session d'édition : sans ce
 * bandeau, toutes les modifications suivantes (supprimer un code, réordonner, renommer la liste)
 * partiraient sur la liste partagée sans plus aucun signal à l'écran.
 */
export const SharedCodeListNotice = ({
  otherVariableNames,
}: Readonly<SharedCodeListNoticeProps>) => {
  const { t } = useTranslation();

  if (otherVariableNames.length === 0) {
    return null;
  }

  const listed = otherVariableNames.slice(0, MAX_LISTED_NAMES).join(", ");
  const remaining = otherVariableNames.length - MAX_LISTED_NAMES;

  return (
    <div className="shared-code-list-notice">
      <i className="pi pi-users" aria-hidden="true" />
      <span className="flex flex-column gap-1">
        <span>
          {t("physicalInstance.view.code.sharedNotice.message", {
            count: otherVariableNames.length,
          })}
        </span>
        <span className="shared-code-list-notice-impacted">
          {remaining > 0
            ? t("physicalInstance.view.code.override.andMore", {
                names: listed,
                count: remaining,
              })
            : listed}
        </span>
      </span>
    </div>
  );
};
