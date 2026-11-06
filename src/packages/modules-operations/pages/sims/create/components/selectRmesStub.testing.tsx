import { vi } from "vitest";

// Remplaçant de `@components/select-rmes` : enregistre les props reçues.
// Usage : `vi.mock("@components/select-rmes", () => import("./selectRmesStub.testing"))`.
export const selectSpy = vi.fn();

export const Select = (props: any) => {
  selectSpy(props);
  return <div data-testid="select-stub" />;
};

export const lastSelectProps = () => selectSpy.mock.calls.at(-1)?.[0];
