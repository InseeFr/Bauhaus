import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import type { PhysicalInstanceSummary } from "./sharedVariables";
import "./SharedVariableNotice.css";

interface SharedVariableNoticeProps {
  /** PhysicalInstances, autres que celle affichée, qui utilisent la même variable. */
  otherPhysicalInstances: PhysicalInstanceSummary[];
}

/**
 * Rappel permanent, en tête du panneau d'édition, qu'une variable réutilisée appartient aussi à
 * d'autres fichiers (#1387). Il n'y a pas de variante possible : toute modification de la
 * variable sera répercutée dans ces fichiers. Simple indicateur, sans confirmation : la variable se
 * modifie par de nombreux champs, une popup se répéterait à chacun.
 */
export const SharedVariableNotice = ({
  otherPhysicalInstances,
}: Readonly<SharedVariableNoticeProps>) => {
  const { t } = useTranslation();

  if (otherPhysicalInstances.length === 0) {
    return null;
  }

  return (
    <div className="shared-variable-notice">
      <i className="pi pi-share-alt" aria-hidden="true" />
      <span className="flex flex-column gap-1">
        <span>
          {t("physicalInstance.view.sharedVariable.message", {
            count: otherPhysicalInstances.length,
          })}
        </span>
        <span>
          {otherPhysicalInstances.map((physicalInstance, index) => (
            <Fragment key={`${physicalInstance.agency}/${physicalInstance.id}`}>
              {index > 0 && ", "}
              <Link
                to={`/ddi/physical-instances/${physicalInstance.agency}/${physicalInstance.id}`}
              >
                {physicalInstance.label}
              </Link>
            </Fragment>
          ))}
        </span>
      </span>
    </div>
  );
};
