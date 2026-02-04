import { useStructures } from "@utils/hooks/structures";

import D from "../../../../../deprecated-locales/build-dictionary";

export const DataStructure = ({ dataStructure }: Readonly<{ dataStructure: string }>) => {
  const { data: structures } = useStructures();

  return (
    <>
      {D.datasetsDataStructure} :{" "}
      {structures?.find((t) => dataStructure === t.iri)?.labelLg1 ?? dataStructure}
    </>
  );
};
