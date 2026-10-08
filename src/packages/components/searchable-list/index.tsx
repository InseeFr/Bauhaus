import { Column } from "primereact/column";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router";

import { filterKeyDeburr, nbResults } from "@utils/array-utils";

import { componentsI18n } from "../i18n";
import { DataTable, DataTableStateEvent } from "../ui/data-table";
import "./index.css";

const DEFAULT_ROWS_PER_PAGE = 10;
const ROWS_PER_PAGE_OPTIONS = [10, 25, 100];

const readPositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
};

interface SearchableListTypes {
  items: any[];
  advancedSearch?: boolean;
  searchUrl?: string;
  placeholder?: string;
  childPath?: any;
  label?: string;
  autoFocus?: boolean;
  itemFormatter?: any;
}
export const SearchableList = ({
  items = [],
  advancedSearch = false,
  searchUrl = "",
  placeholder,
  childPath,
  label = "label",
  autoFocus = false,
  itemFormatter = (content: any) => content,
}: SearchableListTypes) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const perPage = searchParams.get("perPage");
  const rows = readPositiveInt(perPage, DEFAULT_ROWS_PER_PAGE);

  const filter = filterKeyDeburr();

  const hits = items.filter(filter(search));

  const pageCount = Math.max(1, Math.ceil(hits.length / rows));
  const requestedPage = readPositiveInt(searchParams.get("page"), 1);
  const page = requestedPage > pageCount ? 1 : requestedPage;

  // A new search starts again from the first page, with the same page size.
  const handleSearch = (value: string) => {
    setSearchParams(perPage ? { search: value, perPage } : { search: value });
  };

  const handlePage = (event: DataTableStateEvent) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(event.page! + 1));
    next.set("perPage", String(event.rows));
    setSearchParams(next, { replace: event.rows !== rows });
  };

  const linkTemplate = (item: any) => {
    const path = typeof childPath === "function" ? childPath(item) : childPath;
    return <Link to={`/${path}/${item.id}`}>{itemFormatter(item[label], item)}</Link>;
  };

  return (
    <div className="bauhaus-searchable-list">
      <IconField iconPosition="left" className="bauhaus-searchable-list-search">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder ?? t("searchLabelPlaceholder")}
          aria-label={t("search")}
          autoFocus={autoFocus}
          className="w-full"
        />
      </IconField>
      {advancedSearch && (
        <Link to={searchUrl}>
          <h2>
            <span className="pi pi-search-plus" aria-hidden="true" />
            {t("advancedSearchTitle")}
          </h2>
        </Link>
      )}
      <p aria-live="assertive">{nbResults(hits, t("results"), t("result"))}</p>
      {hits.length > 0 && (
        <DataTable
          value={hits}
          dataKey="id"
          showHeaders={false}
          paginator
          first={(page - 1) * rows}
          rows={rows}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          onPage={handlePage}
        >
          <Column body={linkTemplate} />
        </DataTable>
      )}
    </div>
  );
};
