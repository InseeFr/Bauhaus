import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useNavigationBlocker } from "./useNavigationBlocker";

// Mock useBlocker from react-router-dom
const mockBlocker = {
  state: "unblocked" as "unblocked" | "blocked" | "proceeding",
  proceed: vi.fn(),
  reset: vi.fn(),
};

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useBlocker: () => mockBlocker,
  };
});

describe("useNavigationBlocker", () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, "addEventListener");
    removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    mockBlocker.state = "unblocked";
    mockBlocker.proceed.mockClear();
    mockBlocker.reset.mockClear();
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>{children}</MemoryRouter>
  );

  it("should not add beforeunload listener when shouldBlock is false", () => {
    renderHook(
      () =>
        useNavigationBlocker({
          shouldBlock: false,
        }),
      { wrapper },
    );

    expect(addEventListenerSpy).not.toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });

  it("should add beforeunload listener when shouldBlock is true", () => {
    renderHook(
      () =>
        useNavigationBlocker({
          shouldBlock: true,
        }),
      { wrapper },
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });

  it("should remove beforeunload listener on unmount", () => {
    const { unmount } = renderHook(
      () =>
        useNavigationBlocker({
          shouldBlock: true,
        }),
      { wrapper },
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });

  it("should call onBlock when blocker state is blocked", () => {
    const onBlock = vi.fn();
    mockBlocker.state = "blocked";

    renderHook(
      () =>
        useNavigationBlocker({
          shouldBlock: true,
          onBlock,
        }),
      { wrapper },
    );

    expect(onBlock).toHaveBeenCalledWith(expect.any(Function), expect.any(Function));
  });

  it("should not call onBlock when blocker state is unblocked", () => {
    const onBlock = vi.fn();
    mockBlocker.state = "unblocked";

    renderHook(
      () =>
        useNavigationBlocker({
          shouldBlock: true,
          onBlock,
        }),
      { wrapper },
    );

    expect(onBlock).not.toHaveBeenCalled();
  });

  it("should return the blocker object", () => {
    const { result } = renderHook(
      () =>
        useNavigationBlocker({
          shouldBlock: true,
        }),
      { wrapper },
    );

    expect(result.current).toBe(mockBlocker);
  });

  it("should set event.returnValue in beforeunload handler", () => {
    renderHook(
      () =>
        useNavigationBlocker({
          shouldBlock: true,
        }),
      { wrapper },
    );

    const beforeUnloadHandler = addEventListenerSpy.mock.calls.find(
      (call) => call[0] === "beforeunload",
    )?.[1] as EventListener;

    expect(beforeUnloadHandler).toBeDefined();

    const event = new Event("beforeunload") as BeforeUnloadEvent;
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    beforeUnloadHandler(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(event.returnValue).toBe("");
  });

  it("should remove beforeunload listener when shouldBlock changes from true to false", () => {
    const { rerender } = renderHook(
      ({ shouldBlock }) =>
        useNavigationBlocker({
          shouldBlock,
        }),
      { wrapper, initialProps: { shouldBlock: true } },
    );

    // Verify listener was added
    expect(addEventListenerSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));

    // Clear the spy to track new calls
    removeEventListenerSpy.mockClear();

    // Change shouldBlock to false
    rerender({ shouldBlock: false });

    // Verify listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith("beforeunload", expect.any(Function));
  });
});
