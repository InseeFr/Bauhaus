import { render, fireEvent } from "@testing-library/react";

import { ValidationButton } from "./";

const VALIDATED_OBJECT = { validationState: "Validated" };
const EMPTY_OBJECT = {};
const UPDATED_OBJECT = { validationState: "updated" };

describe("<ValidationButton", () => {
  it("should return nothing if the object is already validated", () => {
    const { container } = render(
      <ValidationButton object={VALIDATED_OBJECT} callback={vi.fn()} disabled={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("should contain a enabled button if the validationStateis not defined", () => {
    const { container } = render(
      <ValidationButton object={EMPTY_OBJECT} callback={vi.fn()} disabled={false} />,
    );
    expect(container.querySelector("button")).toBeEnabled();
  });

  it("should contain a enabled button if the object is already validated", () => {
    const { container } = render(
      <ValidationButton object={UPDATED_OBJECT} callback={vi.fn()} disabled={false} />,
    );
    expect(container.querySelector("button")).toBeEnabled();
  });

  it("should call the callback if we click on the button", () => {
    const callback = vi.fn();
    const { container } = render(
      <ValidationButton object={UPDATED_OBJECT} callback={callback} disabled={false} />,
    );
    fireEvent.click(container.querySelector("button")!);

    expect(callback).toHaveBeenCalledWith(UPDATED_OBJECT);
  });

  it("should be disabled if the property disabled is set to true", () => {
    const callback = vi.fn();
    const { container } = render(
      <ValidationButton object={UPDATED_OBJECT} callback={callback} disabled={true} />,
    );
    expect(container.querySelector("button")).toBeDisabled();
  });
});
