import { useState } from "react";
import { useTranslation } from "react-i18next";

import { cx } from "@utils/cx";

import { isOpen } from "../utils/isOpen";
import { toggleOpen } from "../utils/toggleOpen";
import { OutlineBlock } from "./OutlineBlock";
import "./Outline.css";
import { OutlineButtonWithScroll } from "./OutlineButtonWithScroll";

interface OutlineTypes {
  storeCollapseState?: boolean;
  metadataStructure: any;
  baseUrl?: string;
  disableSectionAnchor?: boolean;
}

export const Outline = ({
  storeCollapseState,
  metadataStructure,
  baseUrl = "/operations/help/",
  disableSectionAnchor,
}: Readonly<OutlineTypes>) => {
  const { t } = useTranslation();

  const [opened, setOpened] = useState(() => storeCollapseState && isOpen(metadataStructure.idMas));

  const expandOrCollapseItem = () => {
    setOpened(!opened);
    if (toggleOpen) {
      toggleOpen(metadataStructure.idMas);
    }
  };

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
            aria-label={opened ? t("app.hide") : t("app.display")}
            aria-expanded={opened}
            onClick={expandOrCollapseItem}
          >
            <span className={cx("pi", `pi-chevron-${opened ? "up" : "down"}`)} aria-hidden="true" />
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
