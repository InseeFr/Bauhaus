import { Sidebar } from "primereact/sidebar";
import type { ReactNode } from "react";

interface RightSlidingPanelTypes {
  isOpen: boolean;
  /** Appelé quand le panneau se ferme : croix, clic sur le masque ou touche Échap. */
  onHide: VoidFunction;
  /** Largeur du panneau, en pourcentage de la fenêtre. */
  size?: number;
  panelClassName?: string;
  children: ReactNode;
}

export const RightSlidingPanel = ({
  isOpen,
  onHide,
  size = 60,
  panelClassName,
  children,
}: Readonly<RightSlidingPanelTypes>) => {
  return (
    <Sidebar
      visible={isOpen}
      position="right"
      onHide={onHide}
      className={panelClassName}
      style={{ width: `${size}%` }}
      blockScroll
    >
      {children}
    </Sidebar>
  );
};
