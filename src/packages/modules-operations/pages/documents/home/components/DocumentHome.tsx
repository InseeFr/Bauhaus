import DOMPurify from "dompurify";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";

import FilterToggleButtons from "@components/filter-toggle-buttons";
import { TextInput } from "@components/form/input";
import { Row } from "@components/layout";
import { NumberResults } from "@components/number-results";
import { PageTitle } from "@components/page-title";
import { Pagination } from "@components/pagination";
import { List } from "@components/ui/list-group";

import { EMPTY_ARRAY, filterKeyDeburr } from "@utils/array-utils";
import { useTitle } from "@utils/hooks/useTitle";

import { HomeDocument } from "../../../../../model/operations/document";
import { Menu } from "../menu";
import { BOTH, DOCUMENT, LINK } from "../../../../constants/documentType";
import { isDocument } from "../../../../utils/isDocument";
import { isLink } from "../../../../utils/isLink";

const formatter = (content: HomeDocument, label: keyof typeof content) => {
  const extraInformations = [];

  if (content.lang) {
    extraInformations.push(content.lang);
  }

  if (content.updatedDate) {
    const [year, month, day] = content.updatedDate.split("-");
    extraInformations.push(`${day}/${month}/${year}`);
  }

  return (
    <>
      {content[label]}{" "}
      <i>{extraInformations.length > 0 ? `(${extraInformations.join("-")})` : ""}</i>
    </>
  );
};

const sessionStorageKey = "documents-displayMode";

const SearchableList = ({
  items = EMPTY_ARRAY,
  placeholder,
  childPath,
  label,
  autoFocus,
  searchValue = "",
}: Readonly<{
  items: HomeDocument[];
  placeholder?: string;
  searchValue?: string;
  autoFocus: boolean;
  label: keyof HomeDocument;
  childPath: (document: HomeDocument) => string;
}>) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const location = useLocation();

  const [search, setSearch] = useState(searchValue);

  const url = document.URL;

  useEffect(() => {
    const searchQuery = new URL(url).searchParams;
    if (searchQuery.has("search")) {
      setSearch(DOMPurify.sanitize(searchQuery.get("search") ?? ""));
    }
  }, [url]);

  const handleSearch = (value: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("search", value);
    navigate(location.pathname + "?" + searchParams.toString(), {
      replace: true,
    });
  };

  const filter = filterKeyDeburr(["label"]);

  const hits = items.filter(filter(search));

  const hitEls = hits.map((item) => (
    <List.Item key={item.id}>
      <Link to={`/${childPath(item)}/${item.id}`}>{formatter(item, label)}</Link>
    </List.Item>
  ));

  return (
    <>
      <div className="row form-group">
        <div className="col-md-12">
          <TextInput
            value={search}
            onChange={(e) => {
              handleSearch(e.target.value);
              setSearch(e.target.value);
            }}
            placeholder={t("app.searchLabelPlaceholder") || placeholder}
            aria-label={t("app.search")}
            autoFocus={autoFocus}
          />
        </div>
      </div>
      <p className="text-center" aria-live="assertive">
        <NumberResults results={hits} />
      </p>
      <Pagination itemEls={hitEls} />
    </>
  );
};

export function DocumentHome({ documents }: Readonly<{ documents: HomeDocument[] }>) {
  const { t } = useTranslation();

  useTitle(t("common.operationsTitle"), t("documents.title"));

  const navigate = useNavigate();

  const queryMode = sessionStorage.getItem(sessionStorageKey);

  const [filter, setFilter] = useState(queryMode || BOTH);

  const filteredDocuments = documents.filter((document: HomeDocument) => {
    return (
      filter === BOTH ||
      (filter === DOCUMENT && isDocument(document)) ||
      (filter === LINK && isLink(document))
    );
  });

  const onFilter = useCallback(
    (mode: typeof BOTH | typeof DOCUMENT | typeof LINK) => {
      sessionStorage.setItem(sessionStorageKey, mode);
      setFilter(mode);
      navigate(window.location.pathname + "?page=1", { replace: true });
    },
    [navigate],
  );

  return (
    <div className="container documents-home">
      <Row>
        <Menu></Menu>
        <div className="col-md-8 text-center pull-right operations-list">
          <PageTitle title={t("documents.searchTitle")} col={12} offset={0} />
          <FilterToggleButtons
            currentValue={filter}
            handleSelection={onFilter}
            options={[
              [DOCUMENT, t("documents.document")],
              [BOTH, `${t("documents.document")} / ${t("documents.titleLink")}`],
              [LINK, t("documents.titleLink")],
            ]}
          />
          <SearchableList
            items={filteredDocuments}
            childPath={(document: HomeDocument) => {
              if (isDocument(document)) {
                return "operations/document";
              }
              return "operations/link";
            }}
            label="label"
            autoFocus={true}
          />
        </div>
      </Row>
    </div>
  );
}
