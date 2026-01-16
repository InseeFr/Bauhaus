import { useState } from "react";

import D from "../../../deprecated-locales";
import { isOpen, toggleOpen } from "../utils";
import { OutlineButtonWithScroll } from "./outline-button-with-scroll";

export const OutlineBlock = ({
  secondary,
  parent,
  baseUrl,
  disableSectionAnchor = false,
  children,
}) => {
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
    <ul className={secondary ? "msd__item-secondary" : "msd__item"}>
      {childrenArray.map((child) => {
        return (
          <li key={child.idMas} className="help-item">
            <div className="msd__item-buttons">
              {Object.keys(child.children).length > 0 && (
                <button
                  type="button"
                  className="msd__item-updown"
                  title={child.opened ? D.hide : D.display}
                  id={child.idMas}
                  onClick={expandOrCollapseItem}
                >
                  <span className={`glyphicon glyphicon-chevron-${child.opened ? "up" : "down"}`} />
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

export default OutlineBlock;
