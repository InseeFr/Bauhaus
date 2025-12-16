import { useEffect, useRef, useState } from "react";

import { ExportButton } from "@components/buttons/buttons-with-icons";

import "./dropdown.scss";

const useOutsideClick = (el, initialState) => {
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const onClick = (e) => {
      // If the active element exists and is clicked outside of
      if (el.current !== null && !el.current.contains(e.target)) {
        setIsActive(!isActive);
      }
    };

    // If the item is active (ie open) then listen for clicks outside
    if (isActive) {
      window.addEventListener("click", onClick);
    }

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [isActive, el]);

  return [isActive, setIsActive];
};

const ExportButtonWithDropdown = ({ actions, disabled = false }) => {
  const dropdownRef = useRef(null);
  const [open, setOpen] = useOutsideClick(dropdownRef, false);

  const onKeyDown = (e) => {
    if (open && e.key === "Escape") {
      setOpen(false);
      dropdownRef.current.querySelector("button").focus();
    }
  };
  useEffect(() => {
    if (open) {
      dropdownRef.current.querySelector("li *")?.focus();
    }
  }, [open]);

  return (
    <div className="dropdown col-md-2" ref={dropdownRef} onKeyDown={onKeyDown}>
      <ExportButton disabled={disabled} col={12} action={() => setOpen(!open)} />
      <div className={`dropdown__content ${open ? "active" : "inactive"}`}>
        <div className="dropdown__info">
          <ul>
            {actions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExportButtonWithDropdown;
