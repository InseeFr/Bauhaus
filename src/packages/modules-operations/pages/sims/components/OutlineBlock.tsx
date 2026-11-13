import { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";

import { cx } from "@utils/cx";

import { isOpen } from "../utils/isOpen";
import { toggleOpen } from "../utils/toggleOpen";
import "./OutlineBlock.css";
import { OutlineButtonWithScroll } from "./OutlineButtonWithScroll";

interface OutlineBlockTypes {
  secondary?: boolean;
  parent: string;
  storeCollapseState?: boolean;
  baseUrl: string;
  disableSectionAnchor?: boolean;
  children: Record<string, any>;
}

export const OutlineBlock = ({
  secondary,
  parent,
  baseUrl,
  disableSectionAnchor = false,
  children,
}: Readonly<OutlineBlockTypes>) => {
  const { t } = useTranslation();

  const [childrenDictionary, setChildrenDictionary] = useState<Record<string, any>>(
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

  // L'identifiant de la rubrique est porté en `data-id` : un `id` doublerait l'ancre de la
  // rubrique dans le formulaire, et `getElementById` rendrait ce bouton, le sommaire précédant
  // le contenu dans la page.
  const expandOrCollapseItem = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    const id = currentTarget.dataset.id!;
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
                  aria-label={child.opened ? t("app.hide") : t("app.display")}
                  aria-expanded={child.opened}
                  data-id={child.idMas}
                  onClick={expandOrCollapseItem}
                >
                  <span
                    className={cx("pi", `pi-chevron-${child.opened ? "up" : "down"}`)}
                    aria-hidden="true"
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
