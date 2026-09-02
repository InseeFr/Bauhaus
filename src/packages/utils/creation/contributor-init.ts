import { Organization } from "@model/organization";

/**
 * For some object (dataset and structure for the moment), if the user
 * is not an admin, we have to initialize the contributor property (during
 * the creation of a new object) with the stamp of the user
 */
export const initializeContributorProperty = (
  isContributor: boolean,
  isCreation: boolean,
  contributor: string | undefined,
): { contributor?: string[] } => {
  if (isContributor && isCreation && contributor) {
    return {
      contributor: [contributor],
    };
  }

  return {};
};

const isIri = (value: string | undefined): value is string =>
  !!value && (value.startsWith("http://") || value.startsWith("https://"));

/**
 * Le back stocke `dc:contributor` comme l'IRI d'une organisation : un timbre
 * (`HIE2001201`, `DG75-L201`) y est refusé — « Not a valid (absolute) IRI ».
 * Les sélecteurs de contributeur travaillent d'ailleurs eux aussi sur des IRI
 * d'organisations : pré-remplir un timbre produit une valeur absente de la
 * liste, et un enregistrement en erreur.
 *
 * On résout donc le timbre de l'utilisateur dans le référentiel des
 * organisations, avec le contributeur par défaut de l'instance en repli. Si
 * rien ne donne une IRI, on ne pré-remplit rien : mieux vaut un champ vide,
 * signalé par la validation, qu'une valeur non enregistrable.
 */
export const resolveContributorIri = ({
  userStamp,
  organisations,
  defaultContributor,
  useUserOrganisation,
}: {
  userStamp: string | undefined;
  organisations: Pick<Organization, "iri" | "id">[];
  defaultContributor: string | undefined;
  useUserOrganisation: boolean;
}): string | undefined => {
  const userOrganisation = useUserOrganisation
    ? organisations.find((organisation) => organisation.id === userStamp)?.iri
    : undefined;

  return [userOrganisation, defaultContributor].find(isIri);
};
