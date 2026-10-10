import { vi } from "vitest";

import { useOrganizations } from "@utils/hooks/organizations";
import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { useAppContext } from "../../application/app-context";

export const USER_STAMP = "DG75-L201";
export const USER_ORGANISATION_IRI = "https://bauhaus/organisations/insee/HIE2001201";
export const DEFAULT_CONTRIBUTOR_IRI = "https://bauhaus/organisations/insee/HIE3014990";

type Privileges = ReturnType<typeof usePrivileges>["privileges"];

/**
 * Contexte par défaut des hooks de création : utilisateur connu, rattaché à une organisation,
 * mais sans droit de création — l'instance impose alors son contributeur par défaut.
 */
export const mockContributorPrefillHooks = () => {
  vi.clearAllMocks();
  vi.mocked(useAppContext).mockReturnValue({
    properties: { defaultContributor: DEFAULT_CONTRIBUTOR_IRI },
  } as ReturnType<typeof useAppContext>);
  vi.mocked(usePrivileges).mockReturnValue({ privileges: [], isPending: false });
  vi.mocked(useUserStamps).mockReturnValue({ data: [{ stamp: USER_STAMP }] } as ReturnType<
    typeof useUserStamps
  >);
  vi.mocked(useOrganizations).mockReturnValue({
    data: [
      {
        iri: USER_ORGANISATION_IRI,
        id: "HIE2001201",
        stamp: USER_STAMP,
        label: "Organisation de l'utilisateur",
        labelLg2: "User organisation",
      },
    ],
  } as ReturnType<typeof useOrganizations>);
};

/** Donne à l'utilisateur le droit de créer sur l'application passée. */
export const givenCreatePrivilegeOn = (application: Privileges[number]["application"]) =>
  vi.mocked(usePrivileges).mockReturnValue({
    privileges: [{ application, privileges: [{ privilege: "CREATE", strategy: "ALL" }] }],
    isPending: false,
  });

/**
 * Les deux cas de pré-remplissage du contributeur, communs aux hooks de création :
 * `renderContributor` rend le hook et en extrait `general.contributor`.
 */
export const itPrefillsTheContributor = (
  application: Privileges[number]["application"],
  renderContributor: () => string | null | undefined,
) => {
  it("pré-remplit le contributeur avec l'organisation de l'utilisateur habilité à créer", () => {
    givenCreatePrivilegeOn(application);

    expect(renderContributor()).toBe(USER_ORGANISATION_IRI);
  });

  it("retombe sur le contributeur par défaut de l'instance sans droit de création", () => {
    expect(renderContributor()).toBe(DEFAULT_CONTRIBUTOR_IRI);
  });
};
