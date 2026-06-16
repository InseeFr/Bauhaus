import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { SearchField, SearchTextField } from "./index";

describe("SearchField", () => {
  it("associates the label with the control through the generated id", () => {
    const { container } = render(
      <SearchField label="My label" col="col-12 md:col-6">
        {(id) => <input id={id} />}
      </SearchField>,
    );

    const input = screen.getByLabelText("My label");
    expect(input).toBeInTheDocument();
    expect(container.querySelector(".field.col-12")).not.toBeNull();
  });
});

describe("SearchTextField", () => {
  it("renders a labelled, search-icon input and forwards typed text", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(
      <SearchTextField label="Label" value="" onChange={onChange} placeholder="search…" />,
    );

    expect(container.querySelector(".p-icon-field .pi-search")).not.toBeNull();

    const input = screen.getByLabelText("Label");
    await user.type(input, "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });
});
