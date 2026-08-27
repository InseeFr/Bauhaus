import { useTranslation } from "react-i18next";

import { SummaryBadge, SummaryEntry, SummaryNav } from "@components/summary-nav";

import { CLOSE_MATCH, NONE } from "@sdk/constants";

import { ConceptNotes, Link } from "../../../../../model/concepts/concept";
import { conceptGeneralFields } from "../../../../utils/conceptGeneralFields";
import { LINK_TYPES } from "../../../../utils/linkTypes";
import { NoteRawTitle, NoteStatus, noteStatus, noteTypes } from "../../../../utils/noteStatus";
import { ConceptWithLink } from "./LinksEdition";

const STATUS_BADGES: Partial<Record<NoteStatus, { key: string; tone: SummaryBadge["tone"] }>> = {
  empty: { key: "concept.notes.statusEmpty", tone: "neutral" },
  missingTranslation: { key: "concept.notes.statusMissingTranslation", tone: "warning" },
  toFix: { key: "concept.notes.statusToFix", tone: "danger" },
};

export type ConceptSection = "general" | "notes" | "links";

interface ConceptSummaryProps {
  notes: ConceptNotes;
  disseminationStatus?: string;
  maxLengthScopeNote: number;
  conceptsWithLinks: ConceptWithLink[];
  equivalentLinks: (Link & { urn: string })[];
  /** Champs en erreur remontés par `validate`, indexés par nom de champ. */
  errorFields?: Record<string, string>;
  activeSection: ConceptSection;
  activeNote: NoteRawTitle;
  activeLinkType: string;
  /**
   * `target` précise ce qui est visé dans la section : la note ou le type de
   * lien à afficher.
   */
  onSelect: (section: ConceptSection, target?: string) => void;
}

export const ConceptSummary = ({
  notes,
  disseminationStatus,
  maxLengthScopeNote,
  conceptsWithLinks,
  equivalentLinks,
  errorFields,
  activeSection,
  activeNote,
  activeLinkType,
  onSelect,
}: Readonly<ConceptSummaryProps>) => {
  const { t, i18n } = useTranslation();
  const t1 = i18n.getFixedT("fr");

  // Les erreurs de note sont déjà portées par la note elle-même : le bloc général
  // ne signale que les siennes. `validate` renvoie toutes les clés du schéma,
  // celles qui vont bien avec un message vide : c'est le message qui fait foi.
  const generalToFix = Object.entries(errorFields ?? {}).some(
    ([field, message]) => message && conceptGeneralFields.includes(field),
  );

  const countOfLinkType = (memberType: string) =>
    memberType === CLOSE_MATCH
      ? equivalentLinks.length
      : conceptsWithLinks.filter(({ typeOfLink }) => typeOfLink === memberType).length;

  const linksCount =
    conceptsWithLinks.filter(({ typeOfLink }) => typeOfLink !== NONE).length +
    equivalentLinks.length;

  const entries: SummaryEntry[] = [
    {
      key: "general",
      label: t("common.globalInformationsTitle"),
      badge: generalToFix ? { label: t("concept.notes.statusToFix"), tone: "danger" } : undefined,
    },
    {
      key: "notes",
      label: t("common.notesTitle"),
      items: noteTypes(maxLengthScopeNote).map((noteType) => {
        const badge = STATUS_BADGES[noteStatus(noteType, notes, disseminationStatus)];
        return {
          key: noteType.rawTitle,
          label: t1(`concept.notes.${noteType.rawTitle}`),
          badge: badge ? { label: t(badge.key), tone: badge.tone } : undefined,
        };
      }),
    },
    {
      key: "links",
      label: t("common.linksTitle"),
      badge: { label: String(linksCount) },
      items: LINK_TYPES.map(({ titleKey, memberType }) => ({
        key: memberType,
        label: t1(titleKey),
        badge: { label: String(countOfLinkType(memberType)) },
      })),
    },
  ];

  const activeKeys = [
    activeSection,
    ...(activeSection === "notes" ? [activeNote as string] : []),
    ...(activeSection === "links" ? [activeLinkType] : []),
  ];

  const select = (key: string) => {
    if (key === "general" || key === "notes" || key === "links") return onSelect(key);
    if (noteTypes(maxLengthScopeNote).some(({ rawTitle }) => rawTitle === key)) {
      return onSelect("notes", key);
    }
    return onSelect("links", key);
  };

  return (
    <SummaryNav
      label={t("common.globalInformationsTitle")}
      entries={entries}
      activeKeys={activeKeys}
      onSelect={select}
    />
  );
};
