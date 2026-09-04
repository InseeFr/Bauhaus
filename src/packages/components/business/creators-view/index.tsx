import { useTranslation } from "react-i18next";

import { Note } from "@components/note";

import { componentsI18n } from "../../i18n";
import { InseeOrganization, InseeOrganizations } from "../organizations/organizations";

export const InseeOrganizationNotes = ({
  organizations,
  title,
}: Readonly<{ organizations?: string | string[]; title?: string }>) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  const resolvedTitle = title ?? t("creatorsInput.creatorTitle", { lng: "fr" });

  if (!organizations || (Array.isArray(organizations) && organizations.length === 0)) {
    return <Note text={<p></p>} title={resolvedTitle} alone={true} allowEmpty={true} />;
  }

  const organizationsArray = Array.isArray(organizations) ? organizations : [organizations];

  if (organizationsArray.length === 1) {
    return (
      <Note
        text={<InseeOrganization creator={organizationsArray[0]}></InseeOrganization>}
        title={resolvedTitle}
        alone={true}
        allowEmpty={true}
      />
    );
  }

  return (
    <Note
      text={<InseeOrganizations creators={organizationsArray} />}
      title={resolvedTitle}
      alone={true}
      allowEmpty={true}
    />
  );
};
