import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { SummaryEntry, SummaryNav } from "@components/summary-nav";

import { useUrlSection } from "@utils/hooks/useUrlSection";

import "./LayoutWithLateralMenu.css";

export interface LayoutItemConfiguration {
  title: string;
  hasError?: boolean;
}

export type LayoutConfiguration = Record<string, LayoutItemConfiguration>;

export const LayoutWithLateralMenu = ({
  children,
  layoutConfiguration,
}: Readonly<{
  layoutConfiguration: LayoutConfiguration;
  children: (key: string) => ReactNode;
}>) => {
  const { t } = useTranslation();

  const [urlKey, setCurrentKey] = useUrlSection(Object.keys(layoutConfiguration)[0]);

  // Une URL peut désigner une partie qui n'existe pas (ou plus) : on retombe sur la première.
  const currentKey = layoutConfiguration[urlKey] ? urlKey : Object.keys(layoutConfiguration)[0];

  const entries: SummaryEntry[] = Object.entries(layoutConfiguration).map(
    ([key, { title, hasError }]) => ({
      key,
      label: title,
      badge: hasError ? { label: t("dataset.toFix"), tone: "danger" } : undefined,
    }),
  );

  return (
    <div className="layout_with_lateral_menu">
      <SummaryNav
        label={t("dataset.summary")}
        entries={entries}
        activeKeys={[currentKey]}
        onSelect={setCurrentKey}
      />
      <section className="layout_with_lateral_menu__content">
        <h2 className="wilco-page-title__title">{layoutConfiguration[currentKey].title}</h2>
        {children(currentKey)}
      </section>
    </div>
  );
};
