import { Note } from "@components/note";
import { D1 } from "../../../modules-operations/i18n/build-dictionary";
import { InseeOrganisation, InseeOrganisations } from "../organisations/organisations";

export const InseeOrganisationNotes = ({
  organisations,
}: Readonly<{ organisations?: string | string[] }>) => {
  if (!organisations || (Array.isArray(organisations) && organisations.length === 0)) {
    return <Note text={<p></p>} title={D1.creatorTitle} alone={true} allowEmpty={true} />;
  }

  const organisationsArray = Array.isArray(organisations) ? organisations : [organisations];

  if (organisationsArray.length === 1) {
    return (
      <Note
        text={<InseeOrganisation creator={organisationsArray[0]}></InseeOrganisation>}
        title={D1.creatorTitle}
        alone={true}
        allowEmpty={true}
      />
    );
  }

  return (
    <Note
      text={<InseeOrganisations creators={organisationsArray} />}
      title={D1.creatorTitle}
      alone={true}
      allowEmpty={true}
    />
  );
};
