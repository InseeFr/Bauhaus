import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DatalistInput } from ".";

const OPTIONS = ["Apple", "Banana"];

const renderInput = (value = "") => {
  const onChange = vi.fn();
  const rendered = render(
    <DatalistInput id="fruit" label="Fruit" options={OPTIONS} value={value} onChange={onChange} />,
  );
  return { ...rendered, onChange };
};

describe("DatalistInput", () => {
  it("labels the input", () => {
    renderInput();

    expect(screen.getByLabelText("Fruit").id).toBe("fruit");
  });

  it("suggests every option through a datalist linked to the input", () => {
    renderInput();

    const input = screen.getByLabelText("Fruit");
    const datalist = document.getElementById(input.getAttribute("list")!);
    const options = Array.from(datalist!.querySelectorAll("option"));
    expect(options.map((option) => option.value)).toEqual(["Apple", "Banana"]);
  });

  it("gives every option a text label", () => {
    renderInput();

    const options = Array.from(document.querySelectorAll("option"));
    expect(options.map((option) => option.textContent)).toEqual(["Apple", "Banana"]);
  });

  it("displays the value", () => {
    renderInput("Banana");

    expect((screen.getByLabelText("Fruit") as HTMLInputElement).value).toBe("Banana");
  });

  it("calls onChange with the typed value", () => {
    const { onChange } = renderInput();

    fireEvent.change(screen.getByLabelText("Fruit"), { target: { value: "Cherry" } });

    expect(onChange).toHaveBeenCalledExactlyOnceWith("Cherry");
  });
});
