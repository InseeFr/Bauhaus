import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { useVisibleModules } from "../../../../application/visible-modules";
import { usePhysicalInstancesSearch } from "../../../hooks/usePhysicalInstancesSearch";
import "./PhysicalInstanceBreadcrumb.css";

interface PhysicalInstanceBreadcrumbProps {
  /** `operationsIri` : série du module opérations dont le groupe est le miroir. */
  group?: { id: string; label: string; operationsIri?: string | null };
  /** `operationsIri` : opération du module opérations dont l'étude est le miroir. */
  studyUnit?: { agency: string; id: string; label: string; operationsIri?: string | null };
  physicalInstance: { agency: string; id: string; label: string };
}

/**
 * Recherche avancée pré-filtrée : ses filtres sont lus dans l'URL. L'opération s'accompagne de
 * sa série, sans laquelle le filtre « opération » de la recherche reste désactivé.
 */
const advancedSearchUrl = (filters: { group?: string; studyUnit?: string }) => {
  const params = new URLSearchParams();
  if (filters.group) params.set("group", filters.group);
  if (filters.studyUnit) params.set("studyUnit", filters.studyUnit);
  return `/ddi/physical-instances/search?${params}`;
};

/** L'identifiant d'une série ou d'une opération est le dernier segment de son IRI. */
const localName = (iri: string) => iri.substring(iri.lastIndexOf("/") + 1);

/**
 * Fil d'Ariane Série › Opération › Fichier de données. Série et opération mènent à leur page dans
 * le module opérations quand celui-ci est proposé à l'utilisateur et qu'elles en sont le miroir ; à défaut, à la
 * recherche avancée filtrée sur elles ; le dernier segment ouvre un sélecteur listant les fichiers de
 * données de la même opération (filtrable), pour passer de l'un à l'autre ; sans opération
 * connue, il reste un simple texte.
 */
export const PhysicalInstanceBreadcrumb = ({
  group,
  studyUnit,
  physicalInstance,
}: Readonly<PhysicalInstanceBreadcrumbProps>) => {
  const { t } = useTranslation();
  const operationsOpen = useVisibleModules().includes("operations");

  const groupUrl =
    operationsOpen && group?.operationsIri
      ? `/operations/series/${localName(group.operationsIri)}`
      : advancedSearchUrl({ group: group?.id });
  const studyUnitUrl =
    operationsOpen && studyUnit?.operationsIri
      ? `/operations/operation/${localName(studyUnit.operationsIri)}`
      : advancedSearchUrl({ group: group?.id, studyUnit: studyUnit?.id });

  return (
    <nav className="pi-breadcrumb" aria-label={t("physicalInstance.view.breadcrumb.label")}>
      <ol>
        {group && (
          <li>
            <Link className="pi-breadcrumb-link" to={groupUrl}>
              <i className="pi pi-folder" aria-hidden="true" />
              <span className="p-hidden-accessible">
                {t("physicalInstance.view.breadcrumb.group")}
              </span>
              <span className="pi-breadcrumb-text" title={group.label}>
                {group.label}
              </span>
            </Link>
          </li>
        )}
        {studyUnit && (
          <li>
            <Link className="pi-breadcrumb-link" to={studyUnitUrl}>
              <i className="pi pi-book" aria-hidden="true" />
              <span className="p-hidden-accessible">
                {t("physicalInstance.view.breadcrumb.studyUnit")}
              </span>
              <span className="pi-breadcrumb-text" title={studyUnit.label}>
                {studyUnit.label}
              </span>
            </Link>
          </li>
        )}
        <li aria-current="page">
          {studyUnit ? (
            <PhysicalInstanceSwitcher studyUnit={studyUnit} current={physicalInstance} />
          ) : (
            <>
              <i className="pi pi-file" aria-hidden="true" />
              <span className="pi-breadcrumb-text" title={physicalInstance.label}>
                {physicalInstance.label}
              </span>
            </>
          )}
        </li>
      </ol>
    </nav>
  );
};

interface PhysicalInstanceSwitcherProps {
  studyUnit: { agency: string; id: string };
  current: { agency: string; id: string; label: string };
}

const PhysicalInstanceSwitcher = ({
  studyUnit,
  current,
}: Readonly<PhysicalInstanceSwitcherProps>) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const { data: rows, isLoading } = usePhysicalInstancesSearch();

  const siblings = useMemo(
    () =>
      (rows ?? [])
        .filter(
          (row) => row.studyUnitAgency === studyUnit.agency && row.studyUnitId === studyUnit.id,
        )
        .map((row) => ({
          agency: row.agency,
          id: row.id,
          label: row.label ?? row.id,
          isCurrent: row.agency === current.agency && row.id === current.id,
        })),
    [rows, studyUnit.agency, studyUnit.id, current.agency, current.id],
  );

  const normalizedFilter = filter.trim().toLowerCase();
  const visibleSiblings = normalizedFilter
    ? siblings.filter((sibling) => sibling.label.toLowerCase().includes(normalizedFilter))
    : siblings;

  const close = () => {
    setIsOpen(false);
    setFilter("");
  };

  // Clic en dehors du bouton et du panneau → fermeture.
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) close();
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [isOpen]);

  const renderList = () => {
    if (isLoading) {
      return <p className="pi-switcher-message">{t("physicalInstance.view.breadcrumb.loading")}</p>;
    }
    if (visibleSiblings.length === 0) {
      return <p className="pi-switcher-message">{t("physicalInstance.view.breadcrumb.noMatch")}</p>;
    }
    return (
      <ul className="pi-switcher-list">
        {visibleSiblings.map((sibling) => (
          <li key={`${sibling.agency}/${sibling.id}`}>
            {sibling.isCurrent ? (
              <span className="pi-switcher-item pi-switcher-current" aria-current="true">
                <i className="pi pi-check" aria-hidden="true" />
                <span>{sibling.label}</span>
              </span>
            ) : (
              <Link
                className="pi-switcher-item"
                to={`/ddi/physical-instances/${sibling.agency}/${sibling.id}`}
                onClick={close}
              >
                <span>{sibling.label}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="pi-switcher" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        className="pi-switcher-button"
        aria-label={t("physicalInstance.view.breadcrumb.switch", { label: current.label })}
        aria-expanded={isOpen}
        aria-controls={panelId}
        title={current.label}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
      >
        <i className="pi pi-file" aria-hidden="true" />
        <span className="pi-breadcrumb-text">{current.label}</span>
        <i className={isOpen ? "pi pi-chevron-up" : "pi pi-chevron-down"} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          id={panelId}
          className="pi-switcher-panel"
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            event.stopPropagation();
            close();
            buttonRef.current?.focus();
          }}
        >
          <div className="pi-switcher-filter">
            <i className="pi pi-search" aria-hidden="true" />
            <input
              type="search"
              autoFocus
              autoComplete="off"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder={t("physicalInstance.view.breadcrumb.filter")}
              aria-label={t("physicalInstance.view.breadcrumb.filter")}
            />
          </div>

          {renderList()}

          <p className="pi-switcher-count">
            {t("physicalInstance.view.breadcrumb.count", { count: siblings.length })}
          </p>
        </div>
      )}
    </div>
  );
};
