import { cx } from "@utils/cx";

import "./summary-nav.css";

export type SummaryBadgeTone = "neutral" | "warning" | "danger";

export interface SummaryBadge {
  label: string;
  tone?: SummaryBadgeTone;
}

export interface SummaryEntry {
  key: string;
  label: string;
  badge?: SummaryBadge;
  /** Entrées de second niveau, affichées sous celle-ci. */
  items?: SummaryEntry[];
}

interface SummaryNavProps {
  /** Nom accessible de la navigation. */
  label: string;
  entries: SummaryEntry[];
  /** Clés des entrées à marquer : la section courante et, s'il y a lieu, son détail. */
  activeKeys?: string[];
  onSelect: (key: string) => void;
}

const Entry = ({
  entry,
  activeKeys,
  onSelect,
}: Readonly<{
  entry: SummaryEntry;
  activeKeys: string[];
  onSelect: (key: string) => void;
}>) => (
  <li>
    <button
      type="button"
      aria-current={activeKeys.includes(entry.key) ? "true" : undefined}
      onClick={() => onSelect(entry.key)}
    >
      {entry.label}
      {entry.badge && (
        <span
          className={cx(
            "summary-nav__badge",
            `summary-nav__badge--${entry.badge.tone ?? "neutral"}`,
          )}
        >
          {entry.badge.label}
        </span>
      )}
    </button>
    {entry.items && entry.items.length > 0 && (
      <ul>
        {entry.items.map((item) => (
          <Entry key={item.key} entry={item} activeKeys={activeKeys} onSelect={onSelect} />
        ))}
      </ul>
    )}
  </li>
);

/**
 * Table des matières d'un formulaire long : elle remplace les onglets, commande
 * ce qui est affiché et porte l'état de chaque partie.
 */
export const SummaryNav = ({
  label,
  entries,
  activeKeys = [],
  onSelect,
}: Readonly<SummaryNavProps>) => (
  <nav className="summary-nav" aria-label={label}>
    <ul>
      {entries.map((entry) => (
        <Entry key={entry.key} entry={entry} activeKeys={activeKeys} onSelect={onSelect} />
      ))}
    </ul>
  </nav>
);
