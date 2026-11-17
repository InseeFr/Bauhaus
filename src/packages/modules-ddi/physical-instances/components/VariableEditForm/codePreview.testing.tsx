import { vi } from "vitest";

/**
 * Doublure de `primereact/button` pour les aperçus de code :
 * `vi.mock("primereact/button", () => import("./codePreview.testing"));`
 */
export const Button = ({ label, onClick, className }: any) => (
  <button onClick={onClick} className={className}>
    {label}
  </button>
);

/** Installe un presse-papiers factice et renvoie son `writeText`. */
export const mockClipboard = (writeText = vi.fn()) => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    writable: true,
    configurable: true,
  });
  return writeText;
};
