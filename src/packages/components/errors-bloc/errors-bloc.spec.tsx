// @vitest-environment jsdom
// DOMPurify ≥ 3.4.8 ne reconnaît plus les éléments du DOM happy-dom (balises sûres
// supprimées, <script> conservé) : ce qui passe par DOMPurify se teste sous jsdom.

import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, it, expect, vi } from "vitest";

import { appI18n } from "../../i18n";
import { sdkRejection } from "../../tests/sdk-rejection.testing";
import { ClientSideError, GlobalClientSideErrorBloc, ErrorBloc, LoadingErrorBloc } from "./index";

describe("ClientSideError", () => {
  it("renders error message when error is provided", () => {
    render(<ClientSideError error="<strong>Error occurred</strong>" id="error1" />);
    screen.getByText("Error occurred");
  });

  it("does not inject event handlers into the error message", () => {
    const { container } = render(
      <ClientSideError error={'<img src="x" onerror="alert(1)">'} id="error1" />,
    );

    expect(container.querySelector("[onerror]")).toBeNull();
  });

  it("does not render anything when error is not provided", () => {
    render(<ClientSideError id="error1" />);
    screen.queryByText("Error occurred");
  });
});

describe("GlobalClientSideErrorBloc", () => {
  it("renders global error message when clientSideErrors are provided", () => {
    render(<GlobalClientSideErrorBloc clientSideErrors={["error1"]} />);
    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveTextContent("You have errors in this form.");
  });

  it("does not render anything when clientSideErrors is undefined", () => {
    render(<GlobalClientSideErrorBloc />);
    const errorElement = screen.queryByRole("alert");
    expect(errorElement).toBeNull();
  });

  it("does not render anything when clientSideErrors is an empty array", () => {
    render(<GlobalClientSideErrorBloc clientSideErrors={[]} />);
    const errorElement = screen.queryByRole("alert");
    expect(errorElement).toBeNull();
  });
});

describe("ErrorBloc", () => {
  it("renders formatted errors for an array of error messages", () => {
    const errors = [
      JSON.stringify({ code: "1101" }),
      JSON.stringify({ status: 500, message: "message" }),
      { status: 500, message: "object" },
      "Plain error message",
    ];
    render(<ErrorBloc error={errors} />);

    screen.getByText("The codelist already exists.");
    screen.getByText(
      "An error has occurred. Please contact the RMéS administration team and provide them with the following message: message",
    );
    screen.getByText(
      "An error has occurred. Please contact the RMéS administration team and provide them with the following message: object",
    );
    screen.getByText("Plain error message");
  });

  it("renders a single error message when error is a string", () => {
    render(<ErrorBloc error="Plain error message" />);
    screen.getByText("Plain error message");
  });

  it("does not inject event handlers coming from a server error message", () => {
    const { container } = render(
      <ErrorBloc error={{ message: '<img src="x" onerror="alert(1)">' }} />,
    );

    expect(container.querySelector("[onerror]")).toBeNull();
  });

  it("keeps the formatting markup of translated messages", () => {
    const { container } = render(<ErrorBloc error="<strong>Title</strong> is mandatory" />);

    expect(container.querySelector("strong")).toHaveTextContent("Title");
  });

  it("renders fallback message when JSON parsing fails", () => {
    const invalidError = "Invalid JSON";
    render(<ErrorBloc error={[invalidError]} />);
    screen.getByText("Invalid JSON");
  });

  describe("never renders an empty or unreadable banner", () => {
    const bannerText = () => screen.getByRole("alert").textContent;

    it("explains a forbidden action when a 403 has no body", () => {
      render(<ErrorBloc error={sdkRejection.emptyBody(403)} />);

      expect(bannerText()).toBe("You do not have permission to perform this action.");
    });

    it("asks to sign in again when a 401 has no body", () => {
      render(<ErrorBloc error={sdkRejection.emptyBody(401)} />);

      expect(bannerText()).toBe(
        "You are not signed in or your session has expired. Please sign in again and retry.",
      );
    });

    it("explains a missing item when a 404 has no body", () => {
      render(<ErrorBloc error={sdkRejection.emptyBody(404)} />);

      expect(bannerText()).toBe("The requested item could not be found.");
    });

    it("renders a generic message when another 4xx has no body", () => {
      render(<ErrorBloc error={sdkRejection.emptyBody(400)} />);

      expect(bannerText()).toBe(
        "An error has occurred. Please try again or contact the RMéS administration team.",
      );
    });

    it("renders a generic server message when a 500 has no body", () => {
      render(<ErrorBloc error={sdkRejection.emptyBody(500)} />);

      expect(bannerText()).toBe(
        "An unexpected error occurred on the server. Please try again later or contact the RMéS administration team.",
      );
    });

    it("renders the detail of a 4xx ProblemDetail", () => {
      render(<ErrorBloc error={sdkRejection.problemDetail(409, "Collection already published")} />);

      expect(bannerText()).toBe("Collection already published");
    });

    it("renders the detail of a 500 ProblemDetail inside the server error message", () => {
      render(<ErrorBloc error={sdkRejection.problemDetail(500, "Repository unavailable")} />);

      expect(bannerText()).toBe(
        "An error has occurred. Please contact the RMéS administration team and provide them with the following message: Repository unavailable",
      );
    });

    it("does not render raw JSON carried by the message", () => {
      render(<ErrorBloc error={sdkRejection.text(403, '{"code":"x","details":"y"}')} />);

      expect(bannerText()).toBe("You do not have permission to perform this action.");
    });

    it("says the server cannot be reached on a network failure", () => {
      render(<ErrorBloc error={sdkRejection.network()} />);

      expect(bannerText()).toBe(
        "The server cannot be reached. Check your connection and try again.",
      );
    });

    it("says the response could not be read when a successful response is unreadable", () => {
      render(<ErrorBloc error={sdkRejection.unreadableResponse(200)} />);

      expect(bannerText()).toBe("The server response could not be read.");
    });

    it("keeps the server message when it is readable", () => {
      render(<ErrorBloc error={sdkRejection.json(409, { message: "Territory already exists" })} />);

      expect(bannerText()).toBe("Territory already exists");
    });
  });

  describe("in French", () => {
    afterEach(() => appI18n.changeLanguage("en"));

    it("renders the fallback message in French", async () => {
      await appI18n.changeLanguage("fr");
      render(<ErrorBloc error={sdkRejection.emptyBody(403)} />);

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Vous n'avez pas les droits pour effectuer cette action.",
      );
    });

    it("explains a failed publication without the technical detail", async () => {
      await appI18n.changeLanguage("fr");
      render(
        <ErrorBloc
          error={sdkRejection.json(503, {
            code: "PUBLICATION_REPOSITORY_UNAVAILABLE",
            message:
              "Publication failed: the dissemination repository is unavailable. Please try again later.",
          })}
        />,
      );

      expect(screen.getByRole("alert")).toHaveTextContent(
        "La publication a échoué : le référentiel de diffusion est indisponible. Réessayez plus tard.",
      );
    });

    it("says the submitted data is invalid when the body cannot be read", async () => {
      await appI18n.changeLanguage("fr");
      render(
        <ErrorBloc
          error={sdkRejection.json(400, {
            code: "INVALID_REQUEST_BODY",
            message: "The submitted data is invalid",
          })}
        />,
      );

      expect(screen.getByRole("alert")).toHaveTextContent("Les données envoyées sont invalides.");
    });

    it("renders the network failure in French", async () => {
      await appI18n.changeLanguage("fr");
      render(<ErrorBloc error={sdkRejection.network()} />);

      expect(screen.getByRole("alert")).toHaveTextContent(
        "Le serveur est injoignable. Vérifiez votre connexion et réessayez.",
      );
    });
  });
});

describe("LoadingErrorBloc", () => {
  // Même toast que l'échec d'enregistrement d'une instance physique (severity error, titre +
  // détail), mais qui reste affiché : la page, elle, est vide.
  const toastMessage = () => document.querySelector(".p-toast-message-error");

  it("shows a PrimeReact error toast, like the physical instance screen, and nothing in the page", async () => {
    const { container } = render(<LoadingErrorBloc error={sdkRejection.emptyBody(500)} />);

    await waitFor(() => expect(toastMessage()).not.toBeNull());
    expect(container.querySelector(".alert-danger, .p-inline-message")).toBeNull();
  });

  it("centers a wide toast at the top of the page, like the DDI toast", async () => {
    render(<LoadingErrorBloc error={sdkRejection.emptyBody(500)} />);

    await waitFor(() => expect(toastMessage()).not.toBeNull());
    expect(toastMessage()?.closest(".p-toast")).toHaveClass("p-toast-top-center", "error-toast");
  });

  it("keeps the toast displayed until the user closes it", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      render(<LoadingErrorBloc error={sdkRejection.emptyBody(500)} />);
      await waitFor(() => expect(toastMessage()).not.toBeNull());

      await act(() => vi.advanceTimersByTimeAsync(60_000));

      expect(toastMessage()).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("says the item could not be found on a 404, whatever the server message", async () => {
    render(<LoadingErrorBloc error={sdkRejection.json(404, { message: "Family not found" })} />);

    await waitFor(() => expect(toastMessage()).not.toBeNull());
    expect(toastMessage()).toHaveTextContent("This item could not be loaded.");
    expect(toastMessage()).toHaveTextContent("This item could not be found.");
    expect(toastMessage()).not.toHaveTextContent("Family not found");
  });

  it("gives the server message as detail", async () => {
    render(<LoadingErrorBloc error={sdkRejection.json(409, { message: "Repository locked" })} />);

    expect(await screen.findByText("Repository locked")).toBeInTheDocument();
  });

  it("falls back on the status message when the response has no readable body", async () => {
    render(<LoadingErrorBloc error={sdkRejection.network()} />);

    expect(
      await screen.findByText("The server cannot be reached. Check your connection and try again."),
    ).toBeInTheDocument();
  });

  it("shows the toast only once for the same failure", async () => {
    const error = sdkRejection.emptyBody(404);
    const { rerender } = render(<LoadingErrorBloc error={error} />);
    await waitFor(() => expect(toastMessage()).not.toBeNull());

    rerender(<LoadingErrorBloc error={error} />);

    expect(document.querySelectorAll(".p-toast-message-error")).toHaveLength(1);
  });

  describe("in French", () => {
    afterEach(() => appI18n.changeLanguage("en"));

    it("renders the toast in French", async () => {
      await appI18n.changeLanguage("fr");
      render(<LoadingErrorBloc error={sdkRejection.emptyBody(404)} />);

      expect(await screen.findByText("Cette fiche est introuvable.")).toBeInTheDocument();
      expect(screen.getByText("Impossible de charger cette fiche.")).toBeInTheDocument();
    });
  });
});
