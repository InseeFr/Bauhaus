import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAllCodesLists } from "../../../hooks/useAllCodesLists";
import { formatDate } from "../../../utils/formatDate";

interface ReuseCodeListSelectProps {
  selectedCodeListId: string | null;
  onCodeListSelect: (value: string) => void;
}

interface CodeListOption {
  value: string;
  label: string;
  /** Nom technique : recherchable mais non affiché (sauf affichage de debug temporaire). */
  name?: string;
  mutualized: boolean;
}

export const ReuseCodeListSelect = ({
  selectedCodeListId,
  onCodeListSelect,
}: Readonly<ReuseCodeListSelectProps>) => {
  const { t } = useTranslation();
  const { id: physicalInstanceId = "", agencyId = "" } = useParams<{
    id: string;
    agencyId: string;
  }>();
  const {
    data: codesLists = [],
    groupLabel,
    isLoading: isLoadingCodesLists,
    error: codesListsError,
  } = useAllCodesLists(agencyId, physicalInstanceId);

  if (isLoadingCodesLists) {
    return (
      <div className="flex gap-2">
        <ProgressSpinner style={{ width: "20px", height: "20px", margin: "0" }} strokeWidth="4" />
        <span>{t("physicalInstance.view.code.loadingCodesLists")}</span>
      </div>
    );
  }

  if (codesListsError) {
    return (
      <Message severity="error" text={t("physicalInstance.view.code.errorLoadingCodesLists")} />
    );
  }

  if (codesLists.length === 0) {
    return <Message severity="info" text={t("physicalInstance.view.code.noCodesListsAvailable")} />;
  }

  const toOption = (cl: (typeof codesLists)[number]): CodeListOption => {
    const formattedDate = formatDate(cl.versionDate);
    return {
      // La date de version (mutualisées) est ajoutée entre parenthèses au libellé affiché.
      value: `${cl.agencyId}-${cl.id}`,
      label: formattedDate ? `${cl.label} (${formattedDate})` : cl.label,
      name: cl.name,
      mutualized: Boolean(cl.mutualized),
    };
  };

  const versionDateTime = (date?: string) => {
    if (!date) return Number.NEGATIVE_INFINITY;
    const time = new Date(date).getTime();
    return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
  };

  // Tri des listes mutualisées : libellé par ordre alphabétique croissant ; à libellé égal,
  // la version la plus récente (versionDate) d'abord. Trie sur le libellé/date bruts (et non
  // sur le libellé déjà suffixé par la date) pour que le tie-break reste chronologique.
  const byLabelThenMostRecent = (
    a: (typeof codesLists)[number],
    b: (typeof codesLists)[number],
  ) => {
    const byLabel = a.label.localeCompare(b.label, "fr", { sensitivity: "base" });
    return byLabel !== 0
      ? byLabel
      : versionDateTime(b.versionDate) - versionDateTime(a.versionDate);
  };

  const groupedOptions = [
    {
      // En-tête de la section « groupe » = libellé du groupe parent de la PI, préfixé
      // par « Groupe : » ; repli sur l'intitulé générique si le libellé n'est pas disponible.
      label: groupLabel
        ? t("physicalInstance.view.code.groupCodesListsSectionNamed", { group: groupLabel })
        : t("physicalInstance.view.code.groupCodesListsSection"),
      // Même tri que les mutualisées : libellé asc, puis version la plus récente d'abord.
      items: codesLists
        .filter((cl) => !cl.mutualized)
        .sort(byLabelThenMostRecent)
        .map(toOption),
    },
    {
      label: t("physicalInstance.view.code.mutualizedCodesListsSection"),
      // Tri alphabétique par libellé ; à libellé égal, version la plus récente d'abord.
      // (Tri sur les données brutes avant la transformation en option.)
      items: codesLists
        .filter((cl) => cl.mutualized)
        .sort(byLabelThenMostRecent)
        .map(toOption),
    },
  ].filter((group) => group.items.length > 0);

  const itemTemplate = (option: CodeListOption) => (
    <div className="flex align-items-center justify-content-between gap-2">
      <span>{option.label}</span>
      {option.mutualized && (
        <i
          className="pi pi-lock"
          data-testid="mutualized-lock"
          title={t("physicalInstance.view.code.mutualizedReadOnly")}
        />
      )}
    </div>
  );

  return (
    <Dropdown
      filter
      // Recherche sur le libellé ET le nom technique ; seul le libellé est affiché (optionLabel).
      filterBy="label,name"
      value={selectedCodeListId}
      options={groupedOptions}
      optionLabel="label"
      optionValue="value"
      optionGroupLabel="label"
      optionGroupChildren="items"
      itemTemplate={itemTemplate}
      onChange={(e) => {
        onCodeListSelect(e.value);
      }}
      placeholder={t("physicalInstance.view.code.selectCodeList")}
      className="w-full"
    />
  );
};
