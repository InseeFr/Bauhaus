import { ReactNode, RefObject, useEffect, useRef, useState } from "react";

import { ExportButton } from "@components/buttons/buttons-with-icons";

import "./dropdown.scss";
import { cx } from "@utils/cx";

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

const ExportButtonWithDropdown = ({
  actions,
  disabled = false,
}: Readonly<ExportButtonWithDropdownProps>) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useOutsideClick(dropdownRef, false);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (open && e.key === "Escape") {
      setOpen(false);
      dropdownRef.current?.querySelector("button")?.focus();
    }
  };
  useEffect(() => {
    if (open) {
      (dropdownRef.current?.querySelector("li *") as HTMLElement | null)?.focus();
    }
  }, [open]);

  return (
    <div className="dropdown col-md-2" ref={dropdownRef} onKeyDown={onKeyDown}>
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

export default ExportButtonWithDropdown;
