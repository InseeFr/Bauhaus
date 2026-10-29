import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { FilterToggleButtons } from "@components/filter-toggle-buttons";
import { HomePageLayout } from "@components/home-page-layout";
import { SearchableList } from "@components/searchable-list";

import { useTitle } from "@utils/hooks/useTitle";

import { MUTUALIZED_COMPONENT_TYPES } from "../../../constants";
import { mutualizedComponentsQuery } from "../../../hooks/queries";
import { formatLabel } from "../../../utils/formatLabel";
import "./page.css";
import { HomePageMenu } from "./menu";

const ALL = "ALL";
const sessionStorageKey = "components-displayMode";

export const Component = () => {
  const { t } = useTranslation();

  useTitle(t("structure.pluralTitle"), t("component.pluralTitle"));

  const navigate = useNavigate();

  const { data: items } = useSuspenseQuery(mutualizedComponentsQuery());

  const queryMode = sessionStorage.getItem(sessionStorageKey);

  const [filter, setFilter] = useState(queryMode || ALL);

  const onFilter = useCallback(
    (mode: string) => {
      void navigate(window.location.pathname + "?page=1");
      setFilter(mode);
    },
    [navigate],
  );

  useEffect(() => {
    sessionStorage.setItem(sessionStorageKey, filter);
  }, [filter]);

  const filteredItems = items
    .filter((item) => {
      return filter === ALL || item?.type === filter;
    })
    .map(({ id, labelLg1, labelLg2 }) => ({ id, labelLg1, labelLg2 }));

  return (
    <HomePageLayout title={t("component.homePageTitle")} menu={<HomePageMenu filter={filter} />}>
      <div className="structures-components-list">
        <FilterToggleButtons
          currentValue={filter}
          handleSelection={onFilter}
          // `FilterToggleButtons` is typed for its original document-filter use (`BOTH` /
          // `document` / `link`) but is fully generic at runtime; reused here for component
          // types, so its overly-narrow literal typing is cast away rather than widened.
          options={
            [
              [ALL, t("all")],
              ...MUTUALIZED_COMPONENT_TYPES.map((type) => [type.value, type.labelPlural]),
            ] as unknown as ["BOTH" | "document" | "link", string][]
          }
        />
        <SearchableList
          items={filteredItems}
          childPath="structures/components"
          advancedSearch
          searchUrl="/structures/components/search"
          itemFormatter={(_: unknown, component: any) => formatLabel(component)}
        />
      </div>
    </HomePageLayout>
  );
};
