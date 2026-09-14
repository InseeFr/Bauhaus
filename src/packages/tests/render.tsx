import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { PropsWithChildren, ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";

import { MODULE, PRIVILEGE, STRATEGY } from "@utils/hooks/rbac-constants";

import { AppContextProvider } from "../application/app-context";
import { testsI18n } from "./i18n";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const WithRouter = ({ children }: PropsWithChildren) => {
  return <MemoryRouter>{children}</MemoryRouter>;
};

export const mockReactQueryForRbac = (
  rbac: {
    application: MODULE;
    privileges: { privilege: PRIVILEGE; strategy: STRATEGY }[];
  }[],
  stamps: { stamp: string }[] = [{ stamp: "stamp" }],
) => {
  vi.doMock("@tanstack/react-query", async () => {
    const actual =
      await vi.importActual<typeof import("@tanstack/react-query")>("@tanstack/react-query");

    return {
      ...actual,
      useQuery: vi.fn().mockImplementation(({ queryKey }) => {
        if (queryKey[0] === "users-stamps") {
          return { isLoading: false, data: stamps };
        }
        return { isLoading: false, data: rbac };
      }),
    };
  });
};

// Un `wrapper` (plutôt qu'un simple JSX autour de `component`) est nécessaire :
// le `rerender` renvoyé par `render()` réapplique automatiquement un `wrapper`
// à chaque appel, alors qu'un JSX englobant écrit une fois pour toutes serait
// perdu si un test appelle `rerender(<AutreComposant />)` sans le réenvelopper.
const RouterWrapper = ({
  children,
  initialEntries,
}: PropsWithChildren<{ initialEntries: string[] }>) => (
  <I18nextProvider i18n={testsI18n}>
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  </I18nextProvider>
);

export const renderWithRouter = (component: ReactNode, initialEntries: string[] = ["/"]) => {
  return render(component, {
    wrapper: ({ children }) => (
      <RouterWrapper initialEntries={initialEntries}>{children}</RouterWrapper>
    ),
  });
};

export const renderWithRouterAndQuery = (
  component: ReactNode,
  initialEntries: string[] = ["/"],
) => {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>
    </QueryClientProvider>,
  );
};

const AppContextProviderWrapper = ({ children }: PropsWithChildren) => (
  <AppContextProvider lg1="fr" lg2="lg2" version="2.0.0" properties={{} as any}>
    {children}
  </AppContextProvider>
);

export const renderWithAppContext = (component: ReactNode, withRouter = true) => {
  if (!withRouter) {
    return render(component, {
      wrapper: ({ children }) => (
        <I18nextProvider i18n={testsI18n}>
          <AppContextProviderWrapper>{children}</AppContextProviderWrapper>
        </I18nextProvider>
      ),
    });
  }

  return render(component, {
    wrapper: ({ children }) => (
      <RouterWrapper initialEntries={["/"]}>
        <AppContextProviderWrapper>{children}</AppContextProviderWrapper>
      </RouterWrapper>
    ),
  });
};
