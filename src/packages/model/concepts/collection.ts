/**
 * TypeScript counterparts of the Java DTOs exposed by
 * `fr.insee.rmes.modules.concepts.collections.webservice`.
 */

/** Mirrors `LocalisedLabelResponse(String value, String lang)`. */
export interface LocalisedLabel {
  value: string;
  /** Uppercased on the wire (`"FR"`/`"EN"`), but request payloads use lowercase. */
  lang: string;
}

/** Mirrors `PartialCollectionResponse(String id, LocalisedLabelResponse label)`. */
export interface PartialCollection {
  id: string;
  label: LocalisedLabel;
}

/** Mirrors `CollectionResponse(...)`. */
export interface Collection {
  id: string;
  labels: LocalisedLabel[];
  descriptions: LocalisedLabel[];
  /** ISO-8601 datetime emitted by Jackson for `LocalDateTime`. */
  created: string;
  modified: string | null;
  isValidated: boolean;
  creator: string;
  contributor: string | null;
}

/** Mirrors `CollectionDashboardItemResponse(...)`. */
export interface CollectionDashboardItem {
  id: string;
  label: string;
  created: string;
  modified: string | null;
  isValidated: boolean;
  creator: string | null;
  nbMembers: number;
}

/** Mirrors `CollectionToValidateResponse(id, label, creator)`. */
export interface UnpublishedCollection {
  id: string;
  label: string;
  creator: string;
}

/** Mirrors `CollectionMemberResponse(id, prefLabelLg1, prefLabelLg2)`. */
export interface CollectionMember {
  id: string;
  prefLabelLg1: string;
  prefLabelLg2: string | null;
}

/** Body accepted by `POST /concepts/collections` and `PUT /concepts/collections/{id}`. */
export interface CollectionPayload {
  id: string;
  labels: LocalisedLabel[];
  descriptions: LocalisedLabel[];
  creator: string;
  contributor?: string;
  created?: string;
  conceptsIdentifiers: string[];
}

/** Format accepted by the export endpoints. Mirrors `CollectionExportType`. */
export type CollectionExportFormat = "odt" | "ods";

/**
 * Flat view-model assembled by the frontend (`useCollection`) for the edit and
 * view pages. The backend response is folded into `prefLabelLgN` /
 * `descriptionLgN` shortcuts driven by the active language.
 */
export interface CollectionGeneral {
  id: string;
  prefLabelLg1: string;
  prefLabelLg2?: string;
  descriptionLg1?: string;
  descriptionLg2?: string;
  creator: string;
  contributor?: string | null;
  created?: string;
  modified?: string | null;
  isValidated?: boolean;
  labels?: LocalisedLabel[];
  descriptions?: LocalisedLabel[];
}

/** Bundled view used by the edit/visualization pages. */
export interface CollectionWithMembers {
  general: CollectionGeneral;
  members: CollectionMember[];
}
