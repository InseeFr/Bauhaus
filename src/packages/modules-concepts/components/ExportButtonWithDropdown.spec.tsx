import { fireEvent, render } from "@testing-library/react";

import { ExportButtonWithDropdown as ExportButton } from "./ExportButtonWithDropdown";

const NO_ACTIONS: never[] = [];
const ONE_ACTION = [
  <button type="button" key={1}>
    Action 1
  </button>,
];

describe("DropDown", () => {
  it("should be closed by default", () => {
    const { container } = render(<ExportButton actions={NO_ACTIONS} />);
    expect(container.querySelector(".dropdown__content")!.classList).toContain("inactive");
  });
  it("should be opened after clicking on the trigger button", () => {
    const { container } = render(<ExportButton actions={ONE_ACTION} />);
    fireEvent.click(container.querySelector("button")!);
    expect(container.querySelector(".dropdown__content")!.classList).toContain("active");
  });
  it("should be closed when pressing the Escape key", () => {
    const { container } = render(<ExportButton actions={NO_ACTIONS} />);
    fireEvent.click(container.querySelector("button")!);
    fireEvent.keyDown(container.querySelector(".dropdown")!, {
      key: "Escape",
      code: "Escape",
      keyCode: 27,
      charCode: 27,
    });
    expect(container.querySelector(".dropdown__content")!.classList).toContain("inactive");
  });
  it("should display the actions props", () => {
    const { container } = render(<ExportButton actions={ONE_ACTION} />);
    expect(container.querySelector("li button")!.innerHTML).toContain("Action 1");
  });
});
