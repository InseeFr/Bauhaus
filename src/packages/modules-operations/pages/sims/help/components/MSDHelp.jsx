import { useParams } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import { HelpInformation } from "./HelpInformation";

export function MSDHelp({ metadataStructure, codelists, organizations }) {
  const { idSection } = useParams();

  function MSDInformations({ msd }) {
    return (
      <>
        <Row key={msd.idMas}>
          <Note
            title={`${msd.idMas} - ${msd.masLabelLg1}`}
            text={<HelpInformation msd={msd} codelists={codelists} organizations={organizations} />}
            alone
          />
        </Row>
        {Object.values(msd.children).map((child) => (
          <MSDInformations key={child.idMas} msd={child} />
        ))}
      </>
    );
  }

  return Object.values(metadataStructure).map((msd) => {
    if (idSection && msd.idMas !== idSection) {
      return null;
    }

    return <MSDInformations key={msd.idMas} msd={msd} />;
  });
}
