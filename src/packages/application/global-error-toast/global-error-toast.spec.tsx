// @vitest-environment jsdom
// Le message passe par DOMPurify, qui ne fonctionne plus sous happy-dom (≥ 3.4.8).

import { QueryClientProvider, useMutation } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { ReactNode, useEffect } from "react";
import { describe, expect, it, vi } from "vitest";

import { sdkRejection } from "../../tests/sdk-rejection.testing";
import { createQueryClient } from "../query-client";
import { GlobalErrorToast } from "./index";

const forbidden = "You do not have permission to perform this action.";
const notFound = "The requested item could not be found.";
const SILENT_META = { globalErrorToast: false };

const FailingMutation = ({
  rejection,
  meta,
  onError,
}: {
  rejection: unknown;
  meta?: { globalErrorToast?: boolean };
  onError?: () => void;
}) => {
  const { mutate } = useMutation({
    mutationFn: () => Promise.reject(rejection),
    meta,
    onError,
  });

  useEffect(() => mutate(), [mutate]);

  return null;
};

const renderWithNotifier = (screenUnderTest?: ReactNode) =>
  render(
    <QueryClientProvider client={createQueryClient()}>
      <GlobalErrorToast />
      {screenUnderTest}
    </QueryClientProvider>,
  );

const dispatchUnhandledRejection = (reason: unknown) => {
  const event = Object.assign(new Event("unhandledrejection", { cancelable: true }), {
    reason,
    promise: Promise.resolve(),
  });
  window.dispatchEvent(event);
};

describe("GlobalErrorToast", () => {
  it("notifies a failed mutation the screen does not handle, with the banner message", async () => {
    renderWithNotifier(<FailingMutation rejection={sdkRejection.emptyBody(403)} />);

    expect(await screen.findByText(forbidden)).toBeInTheDocument();
  });

  it("notifies an api call rejected without catch", async () => {
    renderWithNotifier();

    dispatchUnhandledRejection(sdkRejection.network());

    expect(
      await screen.findByText("The server cannot be reached. Check your connection and try again."),
    ).toBeInTheDocument();
  });

  it("ignores an unhandled rejection which does not come from the api", async () => {
    renderWithNotifier();

    dispatchUnhandledRejection(new Error("Unexpected token"));
    dispatchUnhandledRejection(sdkRejection.emptyBody(404));

    await screen.findByText(notFound);
    expect(screen.queryByText("Unexpected token")).toBeNull();
  });

  it("does not notify a mutation whose screen displays the error itself", async () => {
    renderWithNotifier(
      <>
        <FailingMutation rejection={sdkRejection.emptyBody(403)} meta={SILENT_META} />
        <FailingMutation rejection={sdkRejection.emptyBody(404)} />
      </>,
    );

    await screen.findByText(notFound);
    expect(screen.queryByText(forbidden)).toBeNull();
  });

  it("does not notify a mutation which handles its error with onError", async () => {
    let handled = false;
    renderWithNotifier(
      <>
        <FailingMutation
          rejection={sdkRejection.emptyBody(403)}
          onError={vi.fn(() => {
            handled = true;
          })}
        />
        <FailingMutation rejection={sdkRejection.emptyBody(404)} />
      </>,
    );

    await screen.findByText(notFound);
    expect(handled).toBe(true);
    expect(screen.queryByText(forbidden)).toBeNull();
  });

  it("notifies only once a failed mutation whose promise is also left unhandled", async () => {
    const rejection = sdkRejection.emptyBody(403);
    renderWithNotifier(<FailingMutation rejection={rejection} />);
    await screen.findByText(forbidden);

    dispatchUnhandledRejection(rejection);

    await waitFor(() => expect(screen.getAllByText(forbidden)).toHaveLength(1));
  });
});
