import { useLoaderData } from "react-router-dom";

import { Loading } from "@components/loading";

import { useOrganizations } from "@utils/hooks/organizations";

import { useCodelists } from "../../../hooks/useCodelists";
import { useMetadataStructure } from "../../../hooks/useMetadataStructure";
import { SimsLoaderData } from "../../../types/sims";
import { MSDLayout } from "../components/MSDLayout";
import { MSDHelp } from "./components/MSDHelp";

export const Component = () => {
  const { baseUrl, disableSectionAnchor } = (useLoaderData() as SimsLoaderData) ?? {};

  const { data: organizations } = useOrganizations();

  const { isLoading: metadataStructureLoading, metadataStructure } = useMetadataStructure();

  const { codelists } = useCodelists(metadataStructure);

  if (metadataStructureLoading) return <Loading />;

  return (
    <MSDLayout
      metadataStructure={metadataStructure}
      storeCollapseState
      baseUrl={baseUrl ?? ""}
      disableSectionAnchor={disableSectionAnchor ?? false}
    >
      <MSDHelp
        metadataStructure={metadataStructure}
        codelists={codelists}
        organizations={organizations}
      />
    </MSDLayout>
  );
};
