import { useMemo, useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Link } from "../link";
import { Select } from "../select-rmes";
import "./pagination.css";
import componentsI18n from "../i18n/index";

const PAGE_WINDOW_SIZE = 3;

const numberPerPageOptions = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "100", label: "100" },
];

interface PaginationProps {
  readonly itemEls: JSX.Element[];
}

export const Pagination = ({ itemEls }: PaginationProps) => {
  const { t } = useTranslation("translation", { i18n: componentsI18n });
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const [numberPerPage, setNumberPerPage] = useState(10);

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    if (searchParams.has("perPage")) {
      const perPageValue = Number.parseInt(searchParams.get("perPage")!, 10);
      if (!Number.isNaN(perPageValue) && perPageValue > 0) {
        setNumberPerPage(perPageValue);
      }
    }
  }, [search]);

  const currentPage = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    const pageParam = searchParams.get("page");
    const parsed = Number.parseInt(pageParam || "1", 10);
    return Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
  }, [search]);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(itemEls.length / numberPerPage);
    // Reset to page 1 if current page is out of bounds
    const safePage = currentPage > totalPages ? 1 : currentPage;
    const indexOfLastItem = safePage * numberPerPage;
    const indexOfFirstItem = indexOfLastItem - numberPerPage;
    const currentItems = itemEls.slice(indexOfFirstItem, indexOfLastItem);

    return {
      totalPages,
      safePage,
      currentItems,
      pageNumbers: Array.from({ length: totalPages }, (_, i) => i + 1),
    };
  }, [itemEls, numberPerPage, currentPage]);

  const buildPageUrl = useCallback(
    (page: number): string => {
      const searchParams = new URLSearchParams(search);
      searchParams.set("page", String(page));
      searchParams.set("perPage", String(numberPerPage));
      return `${pathname}?${searchParams.toString()}`;
    },
    [pathname, search, numberPerPage],
  );

  const getAriaLabel = useCallback(
    (page?: number): string => {
      return page ? `${t("pagination.goTo")} ${page}` : "";
    },
    [t],
  );

  const handleItemsPerPageChange = useCallback(
    (value: string) => {
      const searchParams = new URLSearchParams(search);
      searchParams.set("perPage", value);
      searchParams.set("page", "1"); // Reset to first page
      navigate(`${pathname}?${searchParams.toString()}`, { replace: true });
    },
    [navigate, pathname, search],
  );

  const visiblePageNumbers = useMemo(() => {
    return paginationData.pageNumbers.filter(
      (page) =>
        page >= paginationData.safePage - PAGE_WINDOW_SIZE &&
        page <= paginationData.safePage + PAGE_WINDOW_SIZE,
    );
  }, [paginationData.pageNumbers, paginationData.safePage]);

  const isFirstPage = paginationData.safePage === 1;
  const isLastPage = paginationData.safePage === paginationData.totalPages;

  return (
    <>
      <ul className="list-group">{paginationData.currentItems}</ul>
      <div>
        <div className="col-md-3 pull-left wilco-pagination">
          <label htmlFor="items-per-page" className="sr-only">
            {t("pagination.itemPerPagePlaceholder")}
          </label>
          <Select
            placeholder={t("pagination.itemPerPagePlaceholder")}
            value={String(numberPerPage)}
            options={numberPerPageOptions}
            onChange={handleItemsPerPageChange}
            unclearable
          />
        </div>
        <div className="col-md-9" style={{ padding: 0 }}>
          <nav aria-label={t("pagination.navigation")}>
            <ul className="wilco-pagination pull-right">
              {/* First page */}
              <li>
                <Link
                  to={buildPageUrl(1)}
                  aria-label={t("pagination.firstPage")}
                  disabled={isFirstPage}
                >
                  <span aria-hidden="true">&laquo;</span>
                </Link>
              </li>

              {/* Previous page */}
              <li>
                <Link
                  to={buildPageUrl(paginationData.safePage - 1)}
                  aria-label={t("pagination.previousPage")}
                  disabled={isFirstPage}
                >
                  <span aria-hidden="true">&lt;</span>
                </Link>
              </li>

              {/* Page numbers */}
              {visiblePageNumbers.map((page) => (
                <li key={page} className={page === paginationData.safePage ? "active" : ""}>
                  <Link
                    to={buildPageUrl(page)}
                    aria-label={getAriaLabel(page)}
                    aria-current={page === paginationData.safePage ? "page" : undefined}
                  >
                    {page}
                  </Link>
                </li>
              ))}

              {/* Next page */}
              <li>
                <Link
                  to={buildPageUrl(paginationData.safePage + 1)}
                  aria-label={t("pagination.nextPage")}
                  disabled={isLastPage}
                >
                  <span aria-hidden="true">&gt;</span>
                </Link>
              </li>

              {/* Last page */}
              <li>
                <Link
                  to={buildPageUrl(paginationData.totalPages)}
                  aria-label={t("pagination.lastPage")}
                  disabled={isLastPage}
                >
                  <span aria-hidden="true">&raquo;</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};
