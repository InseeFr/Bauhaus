import { useAppContext } from "../../application/app-context";
import { useOrganizations } from "../hooks/organizations";
import { useUserStamps } from "../hooks/users";
import { resolveContributorIri } from "./contributor-init";

/**
 * IRI d'organisation à utiliser comme contributeur par défaut à la création
 * d'un objet.
 *
 * @param useUserOrganisation rattacher l'objet à l'organisation de
 * l'utilisateur (cas d'un utilisateur dont les droits sont portés par son
 * timbre) plutôt qu'au contributeur par défaut de l'instance.
 */
export const useDefaultContributor = (useUserOrganisation: boolean): string | undefined => {
  const {
    properties: { defaultContributor },
  } = useAppContext();
  const { data: organisations = [] } = useOrganizations();
  const { data: stamps = [] } = useUserStamps();

  return resolveContributorIri({
    userStamp: stamps[0]?.stamp,
    organisations,
    defaultContributor,
    useUserOrganisation,
  });
};
