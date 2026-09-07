import { ReactNode } from "react";
import { Card } from "primereact/card";
import { cx } from "@utils/cx";

/**
 * A titled card wrapping a primeflex form grid, used as the visual container of
 * an advanced-search criteria block. Children are the grid cells (e.g.
 * `SearchField` / `SearchTextField` from `@components/ui/search-field`).
 */
export const AdvancedSearchCard = ({
  title,
  className,
  children,
}: Readonly<{
  title?: string;
  className?: string;
  children: ReactNode;
}>) => (
  <Card title={title} className={cx(className, "mb-4")}>
    <div className="grid formgrid">{children}</div>
  </Card>
);
