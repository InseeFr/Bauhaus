import { useAppContext } from "../../application/app-context";
import { useOrganizations } from "../hooks/organizations";
import { usePrivileges, useUserStamps } from "../hooks/users";
import { resolveContributorIri } from "./contributor-init";

/**
 * IRI d'organisation à utiliser comme contributeur par défaut à la création
 * d'un objet.
 *
 * @param useUserOrganization rattacher l'objet à l'organisation de
 * l'utilisateur (cas d'un utilisateur dont les droits sont portés par son
 * timbre) plutôt qu'au contributeur par défaut de l'instance.
 */
export const useDefaultContributor = (useUserOrganization: boolean): string | undefined => {
  const {
    properties: { defaultContributor },
  } = useAppContext();

  const { data: organizations = [] } = useOrganizations();

  const { data: stamps = [] } = useUserStamps();

  return resolveContributorIri({
    userStamp: stamps[0]?.stamp,
    organizations,
    defaultContributor,
    useUserOrganization,
  });
};

/**
 * Les données dont dépend la résolution — référentiel des organisations, timbre
 * et droits de l'utilisateur — sont-elles encore en cours de chargement ?
 *
 * Tant qu'elles le sont, {@link useDefaultContributor} ne peut renvoyer que le
 * repli (le contributeur de l'instance). Un formulaire de création qui recopie
 * la valeur dans son état local à l'initialisation, sans la resynchroniser
 * ensuite, doit donc attendre la fin du chargement pour ne pas figer ce repli.
 */
export const useIsDefaultContributorPending = (): boolean => {
  const { isPlaceholderData: organisationsPending } = useOrganizations();
  const { isPlaceholderData: stampsPending } = useUserStamps();
  const { isPending: privilegesPending } = usePrivileges();

  return organisationsPending || stampsPending || privilegesPending;
};
