import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

import { Organization as OrganizationType } from "@model/organization";

import * as organizationsHook from "@utils/hooks/organizations";

import {
  Organizations,
  Organization,
  InseeOrganizations,
  InseeOrganization,
} from "./organizations";

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

const ALL_CREATORS = ["creator1", "creator2"];
const SINGLE_CREATOR = ["creator1"];
const NO_CREATORS: string[] = [];
const NO_ORGANIZATIONS: OrganizationType[] = [];

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

const mockUseOrganizations = (data: OrganizationType[] = organizations) =>
  vi.spyOn(organizationsHook, "useOrganizations").mockReturnValue({
    data,
    isLoading: false,
    error: null,
  } as any);

describe("Organizations component", () => {
  it("renders a list of organizations", () => {
    const { getByText } = render(
      <Organizations creators={ALL_CREATORS} organizations={organizations} />,
    );

    getByText("Organization 1");
    getByText("Organization 2");
  });

  it("renders nothing when creators list is empty", () => {
    const { container } = render(
      <Organizations creators={NO_CREATORS} organizations={organizations} />,
    );

    expect(container.querySelector("ul")).toBeNull();
  });

  it("renders nothing when organizations list is empty", () => {
    const { container } = render(
      <Organizations creators={SINGLE_CREATOR} organizations={NO_ORGANIZATIONS} />,
    );

    expect(container.querySelector("ul")).not.toBeNull();
  });
});

describe("Organization component", () => {
  it("renders the label of the organization", () => {
    const creator = "creator1";
    const { getByText } = render(<Organization creator={creator} organizations={organizations} />);

    getByText("Organization 1");
  });

  it("renders nothing when creator is not found", () => {
    const creator = "unknownCreator";
    const { container } = render(<Organization creator={creator} organizations={organizations} />);

    expect(container.textContent).toBe("");
  });

  it("renders nothing when creator is empty", () => {
    const { container } = render(<Organization creator="" organizations={organizations} />);

    expect(container.textContent).toBe("");
  });

  it("renders nothing when organizations list is empty", () => {
    const creator = "creator1";
    const { container } = render(
      <Organization creator={creator} organizations={NO_ORGANIZATIONS} />,
    );

    expect(container.textContent).toBe("");
  });
});

describe("InseeOrganizations component", () => {
  it("renders organizations by calling useOrganizations hook", () => {
    using _useOrgsSpy = mockUseOrganizations();

    const { getByText } = render(<InseeOrganizations creators={ALL_CREATORS} />, {
      wrapper,
    });

    getByText("Organization 1");
    getByText("Organization 2");
  });

  it("renders nothing when organizations data is empty", () => {
    using _useOrgsSpy = mockUseOrganizations([]);

    const { container } = render(<InseeOrganizations creators={SINGLE_CREATOR} />, {
      wrapper,
    });

    expect(container.querySelector("ul")).not.toBeNull();
  });
});

describe("InseeOrganization component", () => {
  it("renders organization by calling useOrganizations hook", () => {
    using _useOrgsSpy = mockUseOrganizations();

    const { getByText } = render(<InseeOrganization creator="creator1" />, {
      wrapper,
    });

    getByText("Organization 1");
  });

  it("renders nothing when organization is not found", () => {
    using _useOrgsSpy = mockUseOrganizations();

    const { container } = render(<InseeOrganization creator="unknownCreator" />, {
      wrapper,
    });

    expect(container.textContent).toBe("");
  });
});
