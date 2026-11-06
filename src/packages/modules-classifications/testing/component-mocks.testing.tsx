import type { ReactNode } from "react";

/**
 * Doublures partagées par les specs du module classifications.
 *
 * Chaque export porte le nom de l'export qu'il remplace, pour qu'un spec puisse écrire
 * `vi.mock("@components/layout", () => import("…/component-mocks.testing"))` : le module
 * mocké expose alors la doublure sous le nom attendu (les exports en trop sont sans effet).
 */

export const mockGoBack = vi.fn();

export const useGoBack = () => mockGoBack;

export const Row = ({ children }: { children?: ReactNode }) => <div>{children}</div>;

export const ActionToolbar = ({ children }: { children?: ReactNode }) => (
  <div data-testid="action-toolbar">{children}</div>
);

export const ReturnButton = ({ action }: { action: () => void }) => (
  <button data-testid="return-button" onClick={action}>
    Back
  </button>
);

export const CheckSecondLang = () => <div data-testid="check-second-lang" />;

/** Menu d'une sous-page de nomenclature (postes, arbre). */
export const Menu = () => <div data-testid="controls" />;

export const Note = ({ title, text }: { title?: ReactNode; text?: ReactNode }) => (
  <div>
    <div data-testid="note-title">{title}</div>
    <div data-testid="note-content">{text}</div>
  </div>
);

export const Loading = () => <div>Loading</div>;

export const Saving = () => <div>Saving</div>;

export const PageTitleBlock = ({ titleLg1 }: { titleLg1?: string }) => <h1>{titleLg1}</h1>;
