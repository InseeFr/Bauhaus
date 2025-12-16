import { render, fireEvent } from "@testing-library/react";

import { ComponentSpecificationModalBody } from ".";

describe("<ComponentSpecificationModal />", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  const specification = {
    required: true,
    attachment: ["http:/purl.org/linked-data/cube#DataSet"],
  };

  it("should call the onClose prop", () => {
    const onClose = vi.fn();
    const { container } = render(
      <ComponentSpecificationModalBody
        specification={specification}
        selectedComponent={{ component: {} }}
        structureComponents={[]}
        onClose={onClose}
      />,
    );
    fireEvent.click(container.querySelector(".modal-header button"));
    expect(onClose).toHaveBeenCalled();
  });
  it("should call the onSave prop", () => {
    const onSave = vi.fn();
    const { container } = render(
      <ComponentSpecificationModalBody
        specification={specification}
        selectedComponent={{ component: {} }}
        structureComponents={[]}
        onSave={onSave}
      />,
    );
    fireEvent.click(container.querySelector(".modal-footer button"));
    expect(onSave).toHaveBeenCalled();
  });
});
