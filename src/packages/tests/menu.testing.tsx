import type { RenderResult } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { expect, it, vi } from "vitest";

/** Menu d'un module : rien sur l'accueil de l'application (la spec mocke `useLocation`). */
export const itRendersNothingOnTheHomePage = (renderMenu: () => RenderResult) =>
  it('should not render anything if the path is "/"', () => {
    vi.mocked(useLocation).mockReturnValue({ pathname: "/" } as any);

    const { container } = renderMenu();

    expect(container.firstChild).toBeNull();
  });
