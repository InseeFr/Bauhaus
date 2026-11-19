import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

import { Select } from "./";

const options = [...Array(5)].map((_, i) => ({
  value: `${i + 1}`,
  label: `Option ${i + 1}`,
}));

describe("select", () => {
  it("renders without crashing", () => {
    render(<Select value="value" placeholder="..." options={options} onChange={vi.fn()} />);
  });

  it("finds an option by a searchable field that is not displayed", async () => {
    const acronymOptions = [
      { value: "g1", label: "Recensement de la population", alternateTitles: "RP" },
      { value: "g2", label: "Enquête emploi", alternateTitles: "EEC" },
    ];
    render(<Select options={acronymOptions} filterBy="label,alternateTitles" onChange={vi.fn()} />);

    fireEvent.click(screen.getByRole("combobox"));
    const listbox = await screen.findByRole("listbox", { hidden: true });
    fireEvent.change(document.querySelector(".p-dropdown-filter")!, { target: { value: "EEC" } });

    await waitFor(() =>
      expect(
        within(listbox)
          .getAllByRole("option", { hidden: true })
          .map((option) => option.textContent),
      ).toEqual(["Enquête emploi"]),
    );
  });
});
