import { ValidationState } from "@components/status";

import { OperationsLink } from "./operations-link";

/**
 * Indicateur tel que `GET /operations/indicator/{id}` le renvoie.
 *
 * Le back sérialise directement le résultat de la requête SPARQL : seuls `id`,
 * `prefLabelLg1` et les trois listes d'organisations (`creators`, `publishers`,
 * `contributors`, ajoutées après coup) sont systématiquement présents. Tout le
 * reste provient de clauses `OPTIONAL` et peut manquer.
 */
export interface Indicator {
  id: string;
  prefLabelLg1: string;
  prefLabelLg2?: string;
  altLabelLg1?: string;
  altLabelLg2?: string;
  abstractLg1?: string;
  abstractLg2?: string;
  historyNoteLg1?: string;
  historyNoteLg2?: string;
  /** Notation du code de périodicité, et notation de la liste dont il vient. */
  accrualPeriodicityCode?: string;
  accrualPeriodicityList?: string;
  created?: string;
  /** L'API renvoie `modified` ; `updated` n'existe qu'à l'écriture. */
  modified?: string;
  idSims?: string;
  validationState?: ValidationState;
  /** URI des organisations, pas des timbres. */
  creators: string[];
  publishers: string[];
  contributors: string[];
  seeAlso?: OperationsLink[];
  replaces?: OperationsLink[];
  isReplacedBy?: OperationsLink[];
  wasGeneratedBy?: OperationsLink[];
}

export type IndicatorsList = {
  altLabel: string;
  id: string;
  label: string;
}[];
