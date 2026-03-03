import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { PropsWithChildren, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { MODULE, PRIVILEGE, STRATEGY } from "@utils/hooks/rbac-constants";

import { AppContextProvider } from "../application/app-context";

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

export const mockReactQuery = (data: unknown) => {
  vi.doMock("@tanstack/react-query", async () => {
    const actual =
      await vi.importActual<typeof import("@tanstack/react-query")>("@tanstack/react-query");
    return {
      ...actual,
      useQuery: vi.fn().mockReturnValue({
        isLoading: false,
        data,
      }),
    };
  });
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

export const renderWithRouter = (component: ReactNode, initialEntries: string[] = ["/"]) => {
  return render(<MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>);
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

export const renderWithAppContext = (component: ReactNode, withRouter = true) => {
  if (!withRouter) {
    return render(
      <AppContextProvider lg1="fr" lg2="lg2" version="2.0.0" properties={{} as any}>
        {component}
      </AppContextProvider>,
    );
  }
  return renderWithRouter(
    <AppContextProvider lg1="fr" lg2="lg2" version="2.0.0" properties={{} as any}>
      {component}
    </AppContextProvider>,
  );
};
