import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { usePhysicalInstancesSearch } from "../../../hooks/usePhysicalInstancesSearch";

interface StudyUnitTagProps {
  label: string;
  studyUnit: { agency: string; id: string };
  /** PI en cours d'édition, exclue de la liste (on ne se propose pas de naviguer vers soi-même). */
  currentPhysicalInstance?: { agency: string; id: string };
  style?: CSSProperties;
}

/**
 * Tag « étude » cliquable : au clic il se transforme en select listant les instances
 * physiques rattachées à cette même study unit ; choisir une PI redirige vers sa page.
 * Échap referme le select et réaffiche le tag.
 */
export const StudyUnitTag = ({
  label,
  studyUnit,
  currentPhysicalInstance,
  style,
}: Readonly<StudyUnitTagProps>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const dropdownRef = useRef<Dropdown>(null);
  const { data: rows } = usePhysicalInstancesSearch();

  const options = useMemo(
    () =>
      (rows ?? [])
        .filter(
          (row) => row.studyUnitAgency === studyUnit.agency && row.studyUnitId === studyUnit.id,
        )
        .filter(
          (row) =>
            !currentPhysicalInstance ||
            row.agency !== currentPhysicalInstance.agency ||
            row.id !== currentPhysicalInstance.id,
        )
        .map((row) => ({ label: row.label ?? row.id, value: `${row.agency}/${row.id}` })),
    [rows, studyUnit.agency, studyUnit.id, currentPhysicalInstance],
  );

  // Échap referme le select et réaffiche le tag. Capture-phase pour passer avant le
  // handler interne du Dropdown (qui, sinon, se contenterait de fermer son panneau).
  useEffect(() => {
    if (!isSelectOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSelectOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [isSelectOpen]);

  // Ouvre directement le panneau du select à l'apparition.
  useEffect(() => {
    if (isSelectOpen) dropdownRef.current?.show?.();
  }, [isSelectOpen]);

  if (isSelectOpen) {
    return (
      <Dropdown
        ref={dropdownRef}
        autoFocus
        // Select blanc (n'hérite pas du gris du tag) mais garde la taille du tag.
        style={{ ...style, backgroundColor: "#ffffff", color: "inherit" }}
        // Panneau d'options rendu inline, juste en dessous du select (pas détaché sur le body).
        appendTo="self"
        // z-index élevé : sans la gestion auto de PrimeReact (perdue avec appendTo="self"),
        // le panneau passerait derrière les champs de recherche situés juste en dessous.
        panelStyle={{ zIndex: 1100 }}
        options={options}
        onChange={(event) => navigate(`/ddi/physical-instances/${event.value}`)}
        placeholder={t("physicalInstance.view.studyUnitSelectPlaceholder")}
        emptyMessage={t("physicalInstance.view.studyUnitSelectEmpty")}
      />
    );
  }

  return (
    <button
      type="button"
      className="p-0 border-none bg-transparent cursor-pointer"
      aria-label={t("physicalInstance.view.studyUnitTag", { label })}
      onClick={() => setIsSelectOpen(true)}
    >
      <Tag
        icon="pi pi-book"
        style={style}
        value={t("physicalInstance.view.studyUnitTag", { label })}
      >
        {/* Chevron : indice visuel que le tag est cliquable (ouvre le select). */}
        <i className="pi pi-chevron-down ml-2" aria-hidden="true" />
      </Tag>
    </button>
  );
};
