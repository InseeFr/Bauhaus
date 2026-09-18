import { vi } from "vitest";

// Chargé par `await import(...)` dans la fabrique du `vi.mock("react-router-dom")` : ce module
// ne doit pas importer `react-router-dom` lui-même.

/** `react-router-dom` réel, dont seul `useLocation` devient un `vi.fn()` à piloter dans le test. */
export const withMockedUseLocation = (actual: object) => ({
  ...actual,
  useLocation: vi.fn(),
});
