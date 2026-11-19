import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { DDIApi } from "@sdk/ddi-api";

import { useVisibleModules } from "../../../../../application/visible-modules";

/** Ligne de `GET /ddi/operation/{id}/physical-instances`. */
export interface OperationPhysicalInstance {
  agency: string;
  id: string;
  label: string | null;
}

const labelOf = (physicalInstance: OperationPhysicalInstance) =>
  physicalInstance.label ?? physicalInstance.id;

/**
 * Fichiers de données (PhysicalInstances DDI) des études dont l'opération est le miroir, triés par
 * libellé. Rien n'est demandé quand le module DDI n'est pas proposé à l'utilisateur, et un échec
 * n'est pas retenté : ces fichiers ne sont qu'un complément de la fiche.
 */
export const useOperationPhysicalInstances = (operationId: string | undefined) => {
  const ddiOpen = useVisibleModules().includes("ddi");

  return useQuery<OperationPhysicalInstance[]>({
    queryKey: ["operationPhysicalInstances", operationId],
    queryFn: () =>
      DDIApi.getOperationPhysicalInstances(operationId).then((rows: OperationPhysicalInstance[]) =>
        [...rows].sort((a, b) => labelOf(a).localeCompare(labelOf(b))),
      ),
    enabled: ddiOpen && !!operationId,
    retry: false,
  });
};

/** Liste des fichiers de données, chacun menant à sa page dans le module DDI. */
export const OperationPhysicalInstancesList = ({
  physicalInstances,
}: Readonly<{ physicalInstances: OperationPhysicalInstance[] }>) => {
  const { t } = useTranslation();

  if (physicalInstances.length === 0) return <p>{t("operationPhysicalInstance.none")}</p>;

  return (
    <ul>
      {physicalInstances.map((physicalInstance) => (
        <li key={`${physicalInstance.agency}/${physicalInstance.id}`}>
          <Link to={`/ddi/physical-instances/${physicalInstance.agency}/${physicalInstance.id}`}>
            {labelOf(physicalInstance)}
          </Link>
        </li>
      ))}
    </ul>
  );
};
