import { useLoaderData } from "react-router-dom";

import { Loading } from "@components/loading";

import { useOrganizations } from "@utils/hooks/organizations";

import { useCodesLists } from "../../../hooks/useCodesLists";
import { useMetadataStructure } from "../../../hooks/useMetadataStructure";
import { MSDComponent as MSDLayout } from "../components/MSDComponent";
import { MSDHelp } from "./components/MSDHelp";

export const Component = () => {
  const { baseUrl, disableSectionAnchor } = useLoaderData() ?? {};
  const { data: organisations } = useOrganizations();
  const { isLoading: metadataStructureLoading, metadataStructure } = useMetadataStructure();
  const { codesLists } = useCodesLists(metadataStructure);

  if (metadataStructureLoading) return <Loading />;

  return (
    <MSDLayout
      metadataStructure={metadataStructure}
      storeCollapseState
      baseUrl={baseUrl}
      disableSectionAnchor={disableSectionAnchor}
    >
      <MSDHelp
        metadataStructure={metadataStructure}
        codesLists={codesLists}
        organisations={organisations}
      />
    </MSDLayout>
  );
};
