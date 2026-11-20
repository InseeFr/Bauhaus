import { ReactNode, RefObject, useEffect, useRef, useState } from "react";

import { ExportButton } from "@components/buttons/buttons-with-icons";

import { cx } from "@utils/cx";

import "./ExportButtonWithDropdown.css";

const useOutsideClick = (
  el: RefObject<HTMLElement | null>,
  initialState: boolean,
): [boolean, (value: boolean) => void] => {
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (el.current !== null && !el.current.contains(e.target as Node)) {
        setIsActive(!isActive);
      }
    };

    if (isActive) {
      window.addEventListener("click", onClick);
    }

    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [isActive, el]);

  return [isActive, setIsActive];
};

interface ExportButtonWithDropdownProps {
  actions: ReactNode[];
  disabled?: boolean;
}

export const ExportButtonWithDropdown = ({
  actions,
  disabled = false,
}: Readonly<ExportButtonWithDropdownProps>) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useOutsideClick(dropdownRef, false);

  // Échap referme le menu et rend le focus au bouton, où qu'il soit dans le menu.
  useEffect(() => {
    const dropdown = dropdownRef.current;
    if (!open || !dropdown) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        dropdown.querySelector("button")?.focus();
      }
    };
    dropdown.addEventListener("keydown", onKeyDown);
    return () => dropdown.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      (dropdownRef.current?.querySelector("li *") as HTMLElement | null)?.focus();
    }
  }, [open]);

  return (
    <div className="dropdown lg:col-2" ref={dropdownRef}>
      <ExportButton disabled={disabled} action={() => setOpen(!open)} />
      <div className={cx("dropdown__content", open ? "active" : "inactive")}>
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
