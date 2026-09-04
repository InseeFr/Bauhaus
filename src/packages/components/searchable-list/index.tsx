import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Row } from "@components/layout";
import { Pagination } from "@components/pagination";

import { filterKeyDeburr, nbResults } from "@utils/array-utils";
import { cx } from "@utils/cx";
import { useUrlQueryParameters } from "@utils/hooks/useUrlQueryParameters";

import { componentsI18n } from "../i18n";
import { List } from "../ui/list-group";

const defautState = {
  search: "",
};

interface SearchableListTypes {
  items: any[];
  advancedSearch?: boolean;
  searchUrl?: string;
  placeholder?: string;
  childPath?: any;
  col?: number;
  colOff?: number;
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
  col = undefined,
  colOff = undefined,
  label = "label",
  autoFocus = false,
  itemFormatter = (content: any) => content,
}: SearchableListTypes) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });

  const {
    form: { search },
    setForm: handleSearch,
  } = useUrlQueryParameters(defautState);

  const filter = filterKeyDeburr();

  const hits = items.filter(filter(search));

  const hitEls = hits.map((item: any) => {
    const path = typeof childPath === "function" ? childPath(item) : childPath;
    return (
      <List.Item key={item.id}>
        <Link to={`/${path}/${item.id}`}>{itemFormatter(item[label], item)}</Link>
      </List.Item>
    );
  });

  const colSize = col ? `col-md-${col}` : "";
  const colOffset = colOff ? `col-md-offset-${colOff}` : "";

  return (
    <div className={cx(colSize, colOffset)}>
      <div className="row form-group">
        <div className="col-md-12">
          <IconField iconPosition="left" className="flex-1">
            <InputIcon className="pi pi-search"> </InputIcon>
            <InputText
              value={search}
              onChange={(e) => {
                handleSearch({ search: e.target.value });
              }}
              placeholder={placeholder ?? t("searchLabelPlaceholder")}
              aria-label={t("search")}
              autoFocus={autoFocus}
              className="w-full"
            />
          </IconField>
        </div>
      </div>
      {advancedSearch && (
        <Row>
          <div className="col-md-12">
            <Link to={searchUrl}>
              <h2>
                <span className="glyphicon glyphicon-zoom-in" aria-hidden="true" />
                {t("advancedSearchTitle")}
              </h2>
            </Link>
          </div>
        </Row>
      )}
      <p aria-live="assertive">{nbResults(hits, t("results"), t("result"))}</p>
      <Pagination itemEls={hitEls} />
    </div>
  );
};
