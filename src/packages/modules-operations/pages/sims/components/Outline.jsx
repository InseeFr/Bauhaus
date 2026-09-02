import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { cx } from "@utils/cx";

import { isOpen } from "../utils/isOpen";
import { toggleOpen } from "../utils/toggleOpen";
import { OutlineBlock } from "./OutlineBlock";
import "./Outline.css";
import { OutlineButtonWithScroll } from "./OutlineButtonWithScroll";

export const Outline = ({
  storeCollapseState,
  metadataStructure,
  baseUrl = "/operations/help/",
  disableSectionAnchor,
}) => {
  const { t } = useTranslation();

  const [opened, setOpened] = useState(() => storeCollapseState && isOpen(metadataStructure.idMas));

  const expandOrCollapseItem = () => {
    setOpened(!opened);
    if (toggleOpen) {
      toggleOpen(metadataStructure.idMas);
    }
  };

  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }, [hash]);

  return (
    <li>
      <div className="msd-outline-primary-item">
        <OutlineButtonWithScroll
          id={metadataStructure.idMas}
          baseUrl={`${baseUrl}${disableSectionAnchor ? "" : metadataStructure.idMas}`}
        >
          {metadataStructure.idMas} - {metadataStructure.masLabelBasedOnCurrentLang}
        </OutlineButtonWithScroll>
        {Object.keys(metadataStructure.children).length > 0 && (
          <button
            type="button"
            className="msd-outline-primary-updown"
            title={opened ? t("app.hide") : t("app.display")}
            onClick={expandOrCollapseItem}
          >
            <span className={cx("glyphicon", `glyphicon-chevron-${opened ? "up" : "down"}`)} />
          </button>
        )}
      </div>
      {opened && (
        <OutlineBlock
          parent={metadataStructure.idMas}
          storeCollapseState={storeCollapseState}
          baseUrl={baseUrl}
          disableSectionAnchor={disableSectionAnchor}
        >
          {metadataStructure.children}
        </OutlineBlock>
      )}
    </li>
  );
};
