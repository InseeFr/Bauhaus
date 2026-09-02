import { Note } from "@components/note";

import { D1 } from "../../i18n";
import { InseeOrganisation, InseeOrganisations } from "../organisations/organisations";

export const InseeOrganisationNotes = ({
  organisations,
  title = D1.creatorsInput.creatorTitle,
}: Readonly<{ organisations?: string | string[]; title?: string }>) => {
  if (!organisations || (Array.isArray(organisations) && organisations.length === 0)) {
    return <Note text={<p></p>} title={title} alone={true} allowEmpty={true} />;
  }

  const organisationsArray = Array.isArray(organisations) ? organisations : [organisations];

  if (organisationsArray.length === 1) {
    return (
      <Note
        text={<InseeOrganisation creator={organisationsArray[0]}></InseeOrganisation>}
        title={title}
        alone={true}
        allowEmpty={true}
      />
    );
  }

  return (
    <Note
      text={<InseeOrganisations creators={organisationsArray} />}
      title={title}
      alone={true}
      allowEmpty={true}
    />
  );
};
