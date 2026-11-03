import { vi } from "vitest";

/**
 * Doublure de `@mantle-ui/react/button` pour les aperçus de code :
 * `vi.mock("@mantle-ui/react/button", () => import("./codePreview.testing"));`
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
