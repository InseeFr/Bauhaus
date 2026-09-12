import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";

import { fetchCodelist } from "@sdk/index";

import { withCodelists } from "./withCodelists";

vi.mock("@sdk/index", () => ({
  fetchCodelist: vi.fn(),
}));

const Probe = (props: Record<string, any>) => (
  <ul>
    <li>{props.title}</li>
    <li>{props.CL_FREQ?.codes?.[0]?.labelLg1 ?? "—"}</li>
    <li>{props.CL_SOURCE?.codes?.[0]?.labelLg1 ?? "—"}</li>
  </ul>
);

const Wrapped = withCodelists(["CL_FREQ", "CL_SOURCE"])(Probe);

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

describe("withCodelists", () => {
  beforeEach(() => vi.clearAllMocks());

  it("passe chaque liste de codes au composant sous le nom de sa notation", async () => {
    vi.mocked(fetchCodelist).mockImplementation((notation: string) =>
      Promise.resolve({ codes: [{ labelLg1: `code de ${notation}` }] }),
    );

    render(<Wrapped title="Titre" />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText("code de CL_FREQ")).toBeInTheDocument();
    });
    expect(screen.getByText("code de CL_SOURCE")).toBeInTheDocument();
  });

  it("laisse passer les propriétés du composant enveloppé", () => {
    vi.mocked(fetchCodelist).mockReturnValue(new Promise(() => {}));

    render(<Wrapped title="Titre" />, { wrapper });

    expect(screen.getByText("Titre")).toBeInTheDocument();
  });
});
