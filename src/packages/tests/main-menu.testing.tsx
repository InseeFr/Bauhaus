import { vi } from "vitest";

/** Doublure de `@components/menu` : `vi.mock("@components/menu", () => import("…/main-menu.testing"))`. */
export const MainMenu = vi.fn(() => <div>MainMenu Mock</div>);
