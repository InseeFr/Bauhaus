import { render, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";

import { withAuth } from "./hoc";
import { NO_AUTH, OPEN_ID_CONNECT_AUTH } from "./constants";
import { useOidc } from "./create-oidc";
import { useAppContext } from "../application/app-context";

vi.mock("./create-oidc", () => ({
  useOidc: vi.fn(),
}));

vi.mock("../application/app-context", () => ({
  useAppContext: vi.fn(),
}));

vi.mock("./open-id-connect-auth/use-oidc", () => ({
  default: ({ WrappedComponent }: { WrappedComponent: () => JSX.Element }) => <WrappedComponent />,
  LoginComponent: () => <div>Login Component</div>,
}));

const TestComponent = () => <div>Test Component</div>;
const AuthTestComponent = withAuth(TestComponent);

describe("auth HOC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render LoginComponent when user is not logged in with OIDC auth", () => {
    (useAppContext as Mock).mockReturnValue({ authType: OPEN_ID_CONNECT_AUTH });
    (useOidc as Mock).mockReturnValue({ isUserLoggedIn: false });

    render(<AuthTestComponent />);

    expect(screen.getByText("Login Component")).toBeInTheDocument();
  });

  it("should render wrapped component when user is logged in with OIDC auth", () => {
    (useAppContext as Mock).mockReturnValue({ authType: OPEN_ID_CONNECT_AUTH });
    (useOidc as Mock).mockReturnValue({ isUserLoggedIn: true });

    render(<AuthTestComponent />);

    expect(screen.getByText("Test Component")).toBeInTheDocument();
  });

  it("should render wrapped component directly when auth type is NO_AUTH", () => {
    (useAppContext as Mock).mockReturnValue({ authType: NO_AUTH });
    (useOidc as Mock).mockReturnValue({ isUserLoggedIn: false });

    render(<AuthTestComponent />);

    expect(screen.getByText("Test Component")).toBeInTheDocument();
  });

  it("should render error when auth type is unknown", () => {
    (useAppContext as Mock).mockReturnValue({ authType: "UNKNOWN_AUTH" });
    (useOidc as Mock).mockReturnValue({ isUserLoggedIn: false });

    render(<AuthTestComponent />);

    expect(screen.getByText("Erreur d'authentification")).toBeInTheDocument();
  });
});
