import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";

import { useCategoryUsers } from "../../../hooks/useCategoryUsers";
import { CategoryUsersPanel } from "./CategoryUsersPanel";

interface CategoryUsageDialogProps {
  visible: boolean;
  onHide: () => void;
  /** Agency de la catégorie dont on affiche les utilisations. */
  agencyId: string;
  categoryId: string;
  /** Libellé de la catégorie, cité dans l'en-tête. */
  categoryLabel: string;
}

/**
 * Popup « Utilisation » d'une ligne de liste de codes : liste toutes les listes de codes qui
 * réutilisent la catégorie de cette ligne, via le même panneau {@link CategoryUsersPanel} que la
 * confirmation d'édition partagée — déplié d'emblée, la popup n'existant que pour cela. Les usages
 * ne sont chargés qu'à l'ouverture.
 */
export const CategoryUsageDialog = ({
  visible,
  onHide,
  agencyId,
  categoryId,
  categoryLabel,
}: Readonly<CategoryUsageDialogProps>) => {
  const { t } = useTranslation();
  const { data: usages = [], isLoading, isError } = useCategoryUsers(agencyId, categoryId, visible);

  const content = () => {
    if (isLoading) {
      return <span>{t("physicalInstance.view.code.categoryUsage.loading")}</span>;
    }
    if (isError) {
      return <span>{t("physicalInstance.view.code.categoryUsage.error")}</span>;
    }
    if (usages.length === 0) {
      return <span>{t("physicalInstance.view.code.categoryUsage.empty")}</span>;
    }
    return (
      <CategoryUsersPanel
        usages={usages}
        title={t("physicalInstance.view.code.categoryUsersPanel.title")}
        help={t("physicalInstance.view.code.categoryUsersPanel.help")}
        tooltipTargetId={`cat-usage-help-${agencyId}-${categoryId}`}
        defaultOpened
      />
    );
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={t("physicalInstance.view.code.categoryUsage.title", { label: categoryLabel })}
      // Largeur figée, comme la popup de confirmation : replier l'arbre ne doit pas la redimensionner.
      style={{ width: "60rem", maxWidth: "95vw" }}
      // Sans cela, le scroll du fond décroche les overlays rendus dans la popup.
      blockScroll
    >
      {content()}
    </Dialog>
  );
};
