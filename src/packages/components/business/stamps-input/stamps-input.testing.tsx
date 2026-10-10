import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { expect, vi } from "vitest";

export const StampsInputMock = ({ labelSingle, labelMulti, lang, value }: any) => (
  <div data-testid="stamps-input">
    <label>{labelSingle}</label>
    <div data-testid="label-multi">{labelMulti}</div>
    <div data-testid="lang">{lang}</div>
    <div data-testid="value">{JSON.stringify(value)}</div>
  </div>
);

type StampsInputWrapper = ComponentType<{
  value: string[];
  onChange: () => void;
  lang: "first";
  multi: boolean;
  required: boolean;
}>;

export const expectAllPropsForwardedToStampsInput = (
  Component: StampsInputWrapper,
  value: string[],
) => {
  const mockOnChange = vi.fn();
  render(
    <Component value={value} onChange={mockOnChange} lang="first" multi={true} required={true} />,
  );

  expect(screen.getByTestId("value")).toHaveTextContent(JSON.stringify(value));
};
