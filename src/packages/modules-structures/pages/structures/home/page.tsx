import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Row } from "@components/layout";
import { PageTitle } from "@components/page-title";
import { SearchableList } from "@components/searchable-list";

import { PartialStructure, StructuresList } from "@model/structures/Structure";

import { StructureApi } from "@sdk/index";

import { useTitle } from "@utils/hooks/useTitle";

import { HomePageMenu } from "./menu";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("structure.pluralTitle"), t("structure.pluralTitle"));

  const [DSDs, setDSDs] = useState<StructuresList>([]);

  useEffect(() => {
    StructureApi.getStructures().then((res: StructuresList) => {
      setDSDs(res);
    });
  }, []);

  return (
    <div className="container">
      <Row>
        <HomePageMenu />
        <div className="col-md-8 text-center pull-right">
          <PageTitle title={t("structure.homePageTitle")} col={12} offset={0} />
          <SearchableList
            items={DSDs}
            childPath="structures"
            advancedSearch
            searchUrl="/structures/search"
            autoFocus
            itemFormatter={(_: unknown, structure: PartialStructure) => structure.labelLg1}
          />
        </div>
      </Row>
    </div>
  );
};
