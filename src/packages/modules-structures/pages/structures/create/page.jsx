import { useTranslation } from "react-i18next";

import { PageTitle } from "@components/page-title";

import { useTitle } from "@utils/hooks/useTitle";

import { EditionForm } from "../edit/components/EditionForm";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("structure.pluralTitle"), t("structure.creationPageTitle"));

  return (
    <>
      <PageTitle title={t("structure.creationPageTitle")} />
      <EditionForm creation={true} />
    </>
  );
};
