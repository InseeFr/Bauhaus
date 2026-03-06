import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Organization as OrganizationType } from "../../../model/organization";
import {
  Organisations,
  Organisation,
  InseeOrganisations,
  InseeOrganisation,
} from "./organisations";
import * as organizationsHook from "../../../utils/hooks/organizations";

const organizations: OrganizationType[] = [
  {
    iri: "creator1",
    label: "Organization 1",
    id: "1",
    labelLg2: "Organization 1 Lg2",
  },
  {
    iri: "creator2",
    label: "Organization 2",
    id: "2",
    labelLg2: "Organization 2 Lg2",
  },
];

describe("Organizations component", () => {
  it("renders a list of organizations", () => {
    const creators = ["creator1", "creator2"];

    const { getByText } = render(
      <Organisations creators={creators} organizations={organizations} />,
    );

    getByText("Organization 1");
    getByText("Organization 2");
  });

  it("renders nothing when creators list is empty", () => {
    const { container } = render(<Organisations creators={[]} organizations={organizations} />);

    expect(container.querySelector("ul")).toBeNull();
  });

  it("renders nothing when organizations list is empty", () => {
    const creators = ["creator1"];
    const { container } = render(<Organisations creators={creators} organizations={[]} />);

    expect(container.querySelector("ul")).not.toBeNull();
  });
});

describe("Organization component", () => {
  it("renders the label of the organization", () => {
    const creator = "creator1";
    const { getByText } = render(<Organisation creator={creator} organizations={organizations} />);

    getByText("Organization 1");
  });

  it("renders nothing when creator is not found", () => {
    const creator = "unknownCreator";
    const { container } = render(<Organisation creator={creator} organizations={organizations} />);

    expect(container.textContent).toBe("");
  });

  it("renders nothing when creator is empty", () => {
    const { container } = render(<Organisation creator="" organizations={organizations} />);

    expect(container.textContent).toBe("");
  });

  it("renders nothing when organizations list is empty", () => {
    const creator = "creator1";
    const { container } = render(<Organisation creator={creator} organizations={[]} />);

    expect(container.textContent).toBe("");
  });
});

describe("InseeOrganisations component", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("renders organizations by calling useOrganizations hook", () => {
    vi.spyOn(organizationsHook, "useOrganizations").mockReturnValue({
      data: organizations,
      isLoading: false,
      error: null,
    } as any);

    const creators = ["creator1", "creator2"];
    const { getByText } = render(<InseeOrganisations creators={creators} />, {
      wrapper,
    });

    getByText("Organization 1");
    getByText("Organization 2");
  });

  it("renders nothing when organizations data is empty", () => {
    vi.spyOn(organizationsHook, "useOrganizations").mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as any);

    const creators = ["creator1"];
    const { container } = render(<InseeOrganisations creators={creators} />, {
      wrapper,
    });

    expect(container.querySelector("ul")).not.toBeNull();
  });
});

describe("InseeOrganisation component", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("renders organization by calling useOrganizations hook", () => {
    vi.spyOn(organizationsHook, "useOrganizations").mockReturnValue({
      data: organizations,
      isLoading: false,
      error: null,
    } as any);

    const { getByText } = render(<InseeOrganisation creator="creator1" />, {
      wrapper,
    });

    getByText("Organization 1");
  });

  it("renders nothing when organization is not found", () => {
    vi.spyOn(organizationsHook, "useOrganizations").mockReturnValue({
      data: organizations,
      isLoading: false,
      error: null,
    } as any);

    const { container } = render(<InseeOrganisation creator="unknownCreator" />, {
      wrapper,
    });

    expect(container.textContent).toBe("");
  });
});
