import { useParams } from "react-router-dom";

import { Row } from "@components/layout";
import { Note } from "@components/note";

import { HelpInformation } from "./HelpInformation";

interface MSDHelpTypes {
  metadataStructure: any;
  codelists?: any;
  organizations?: any[];
}

export function MSDHelp({ metadataStructure, codelists, organizations }: Readonly<MSDHelpTypes>) {
  const { idSection } = useParams();

  function MSDInformations({ msd }: Readonly<{ msd: any }>) {
    return (
      <>
        <Row key={msd.idMas}>
          <Note
            title={`${msd.idMas} - ${msd.masLabelLg1}`}
            text={<HelpInformation msd={msd} codelists={codelists} organizations={organizations} />}
            alone
          />
        </Row>
        {Object.values(msd.children).map((child: any) => (
          <MSDInformations key={child.idMas} msd={child} />
        ))}
      </>
    );
  }

  return Object.values(metadataStructure).map((msd: any) => {
    if (idSection && msd.idMas !== idSection) {
      return null;
    }

    return <MSDInformations key={msd.idMas} msd={msd} />;
  });
}
