import { useSuspenseQuery } from "@tanstack/react-query";
import { screen } from "@testing-library/react";
import { useParams } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { renderWithQuery } from "./render-with-query.testing";

const Page = ({ read }: { read: (id?: string) => Promise<string> }) => {
  const { id } = useParams();
  const { data } = useSuspenseQuery({ queryKey: ["page", id], queryFn: () => read(id) });
  return <p>{data}</p>;
};

describe("renderWithQuery", () => {
  it("renders the page at its route with the route params", async () => {
    renderWithQuery(<Page read={async (id) => `page ${id}`} />, {
      path: "/family/:id",
      route: "/family/f1",
    });

    expect(await screen.findByText("page f1")).toBeInTheDocument();
  });

  it("shows the loading indicator while the page suspends", async () => {
    renderWithQuery(<Page read={() => new Promise(() => undefined)} />);

    expect(await screen.findByRole("status")).toBeInTheDocument();
  });

  it("shows the module error when the page fails to load its data, without retrying", async () => {
    using _error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const read = vi.fn<() => Promise<string>>().mockRejectedValue(new Error("boom"));

    renderWithQuery(<Page read={read} />);

    expect(await screen.findByText("An error has occurred")).toBeInTheDocument();
    expect(read).toHaveBeenCalledTimes(1);
  });

  it("gives the test the client of the page, to seed or observe its cache", async () => {
    const { queryClient } = renderWithQuery(<Page read={async () => "from server"} />, {
      path: "/family/:id",
      route: "/family/f1",
    });

    await screen.findByText("from server");
    expect(queryClient.getQueryData(["page", "f1"])).toBe("from server");
  });
});
