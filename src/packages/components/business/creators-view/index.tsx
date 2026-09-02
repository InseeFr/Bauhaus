import { Note } from "@components/note";

import { D1 } from "../../i18n";
import { InseeOrganization, InseeOrganizations } from "../organizations/organizations";

export const InseeOrganizationNotes = ({
  organizations,
  title = D1.creatorsInput.creatorTitle,
}: Readonly<{ organizations?: string | string[]; title?: string }>) => {
  if (!organizations || (Array.isArray(organizations) && organizations.length === 0)) {
    return <Note text={<p></p>} title={title} alone={true} allowEmpty={true} />;
  }

  const organizationsArray = Array.isArray(organizations) ? organizations : [organizations];

  if (organizationsArray.length === 1) {
    return (
      <Note
        text={<InseeOrganization creator={organizationsArray[0]}></InseeOrganization>}
        title={title}
        alone={true}
        allowEmpty={true}
      />
    );
  }

  return (
    <Note
      text={<InseeOrganizations creators={organizationsArray} />}
      title={title}
      alone={true}
      allowEmpty={true}
    />
  );
};
