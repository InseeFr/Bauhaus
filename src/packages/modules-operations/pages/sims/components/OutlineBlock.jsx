import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { isOpen } from "../utils/isOpen";
import { toggleOpen } from "../utils/toggleOpen";
import { OutlineButtonWithScroll } from "./OutlineButtonWithScroll";
import "./OutlineBlock.css";
import { cx } from "@utils/cx";

export const OutlineBlock = ({
  secondary,
  parent,
  baseUrl,
  disableSectionAnchor = false,
  children,
}) => {
  const { t } = useTranslation();

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

  const [childrenDictionary, setChildrenDictionary] = useState(
    Object.keys(children).reduce((acc, childId) => {
      return {
        ...acc,
        [childId]: {
          ...children[childId],
          opened: isOpen(childId),
        },
      };
    }, {}),
  );

  const expandOrCollapseItem = ({ currentTarget: { id } }) => {
    toggleOpen(id);
    setChildrenDictionary({
      ...childrenDictionary,
      [id]: {
        ...childrenDictionary[id],
        opened: !childrenDictionary[id].opened,
      },
    });
  };

  if (Object.keys(childrenDictionary).length <= 0) return null;

  const childrenArray = Object.values(childrenDictionary);

  return (
    <ul className={secondary ? "msd-item-secondary" : "msd-item"}>
      {childrenArray.map((child) => {
        return (
          <li key={child.idMas} className="help-item">
            <div className="msd-item-buttons">
              {Object.keys(child.children).length > 0 && (
                <button
                  type="button"
                  className="msd-item-updown"
                  title={child.opened ? t("app.hide") : t("app.display")}
                  id={child.idMas}
                  onClick={expandOrCollapseItem}
                >
                  <span
                    className={cx("glyphicon", `glyphicon-chevron-${child.opened ? "up" : "down"}`)}
                  />
                </button>
              )}
              <OutlineButtonWithScroll
                id={child.idMas}
                baseUrl={`${baseUrl}${disableSectionAnchor ? "" : parent}`}
              >
                {child.idMas} - {child.masLabelBasedOnCurrentLang}
              </OutlineButtonWithScroll>
            </div>
            {child.opened && (
              <OutlineBlock
                secondary
                parent={parent}
                baseUrl={baseUrl}
                disableSectionAnchor={disableSectionAnchor}
              >
                {child.children}
              </OutlineBlock>
            )}
          </li>
        );
      })}
    </ul>
  );
};
