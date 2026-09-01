import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MainMenu } from "@components/menu";

import { UIMenuItem } from "@model/Menu";

import { useSims } from "../hooks/useSims";

const ACTIVE = "active";
const defaultAttrs = { "aria-current": "page" };

const buildDefaultPaths = (t: (key: string) => string): Record<string, UIMenuItem> => ({
  families: {
    path: "/operations/families",
    pathKey: /operations\/famil/,
    className: null,
    attrs: null,
    order: 1,
    label: t("common.familiesTitle"),
  },
  series: {
    path: "/operations/series",
    pathKey: /operations\/series/,
    className: null,
    attrs: null,
    order: 2,
    label: t("common.seriesTitle"),
  },
  indicators: {
    path: "/operations/indicators",
    pathKey: /operations\/indicator/,
    className: null,
    attrs: null,
    order: 4,
    label: t("common.indicatorsTitle"),
  },
  help: {
    path: import.meta.env.VITE_OPERATIONS_DOCUMENTATION,
    attrs: {
      target: "_blank",
    },
    pathKey: /help/,
    className: null,
    alignToRight: true,
    order: 6,
    label: t("app.help"),
  },
  document: {
    path: "/operations/documents",
    pathKey: /(link|document)/,
    className: null,
    attrs: null,
    alignToRight: true,
    order: 5,
    label: `${t("documents.document")} / ${t("documents.titleLink")}`,
  },
  operations: {
    path: "/operations/operations",
    pathKey: /operations\/operation/,
    className: "active",
    attrs: defaultAttrs,
    order: 3,
    label: t("common.operationsTitle"),
  },
});

const extractSimsIdFromPathname = (pathname: string): string | undefined => {
  const match = pathname.match(/\/operations\/sims\/([^/]+)/);

  return match ? match[1] : undefined;
};

export const MenuOperations = () => {
  const { t } = useTranslation();

  const { pathname } = useLocation();

  const params = useParams();

  const simsId = params.id || extractSimsIdFromPathname(pathname);

  const { sims } = useSims(pathname.includes("sims") ? simsId : undefined);

  const defaultPaths = buildDefaultPaths(t);

  const paths = Object.entries(defaultPaths).reduce(
    (acc, [key, object]) => {
      let attrs = {};
      if (object.attrs?.target === "_blank") {
        attrs = {
          target: "_blank",
        };
      }
      return {
        ...acc,
        [key]: {
          ...object,
          className: "",
          attrs,
        },
      };
    },
    {} as typeof defaultPaths,
  );

  /**
   * If we are on the SIMS page, we have to check on which parent element we are working on.
   * Two possibilities, during the update phase, we check the presence of the idOperation, idSeries or idIndicator properties of the current SIMS
   * During the creation phase, we are checking the previous page.
   */
  if (pathname.includes("sims")) {
    if (sims?.idSeries || (paths.series.pathKey as RegExp).test(pathname)) {
      paths["series"]["className"] = ACTIVE;
      paths["series"]["attrs"] = defaultAttrs;
    } else if (sims?.idIndicator || (paths.indicators.pathKey as RegExp).test(pathname)) {
      paths["indicators"]["className"] = ACTIVE;
      paths["indicators"]["attrs"] = defaultAttrs;
    } else if (sims?.idOperation || (paths.operations.pathKey as RegExp).test(pathname)) {
      paths["operations"]["className"] = ACTIVE;
      paths["operations"]["attrs"] = defaultAttrs;
    }
  } else {
    for (const key in paths) {
      if ((paths[key]["pathKey"] as RegExp).test(pathname)) {
        paths[key]["className"] = ACTIVE;
        paths[key]["attrs"] = defaultAttrs;

        break;
      }
    }
  }

  return <MainMenu paths={Object.values(paths)} />;
};
