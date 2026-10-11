import { render } from "@testing-library/react";

import { SingleOrNestedListItem } from "./index";

const SINGLE_VALUE = ["Single Value"];
const TEST_VALUE = ["Test"];
const THREE_VALUES = ["Value 1", "Value 2", "Value 3"];
const TWO_ITEMS = ["Item 1", "Item 2"];
const ORDERED_ITEMS = ["First", "Second", "Third"];
const TWO_VALUES = ["Value 1", "Value 2"];
const EMPTY_STRING_VALUE = [""];
const SPECIAL_CHARACTERS_VALUE = ["Value & Co."];

const customGetContent = (value: string) => `Custom: ${value}`;
const unusedGetContent = () => "Should not be used";

describe("SingleOrNestedListItem", () => {
  describe("when items array contains a single item", () => {
    it("renders a simple list item with label and value", () => {
      const { container } = render(<SingleOrNestedListItem items={SINGLE_VALUE} label="Field" />);

      const listItem = container.querySelector("li");
      expect(listItem).not.toBeNull();
      expect(listItem?.textContent).toBe("Field: Single Value");
    });

    it("formats the label and value with a colon separator", () => {
      const { container } = render(<SingleOrNestedListItem items={TEST_VALUE} label="Label" />);

      const listItem = container.querySelector("li");
      expect(listItem?.textContent).toBe("Label: Test");
    });
  });

  describe("when items array contains multiple items", () => {
    it("renders a list item with a nested List component", () => {
      const { container } = render(<SingleOrNestedListItem items={THREE_VALUES} label="Field" />);

      const listItem = container.querySelector("li");
      expect(listItem).not.toBeNull();

      const nestedList = container.querySelector("ul");
      expect(nestedList).not.toBeNull();

      const nestedItems = container.querySelectorAll("ul > li");
      expect(nestedItems).toHaveLength(3);
    });

    it("displays the label followed by the nested list", () => {
      const { container } = render(
        <SingleOrNestedListItem items={TWO_ITEMS} label="Multiple Items" />,
      );

      const listItem = container.querySelector("li");
      expect(listItem?.textContent).toContain("Multiple Items:");
    });

    it("renders each item in the nested list", () => {
      const { container } = render(<SingleOrNestedListItem items={ORDERED_ITEMS} label="Items" />);

      const nestedItems = container.querySelectorAll("ul > li");
      expect(nestedItems[0].textContent).toBe("First");
      expect(nestedItems[1].textContent).toBe("Second");
      expect(nestedItems[2].textContent).toBe("Third");
    });
  });

  describe("when passing additional props", () => {
    it("forwards props to the List component when rendering multiple items", () => {
      const { container } = render(
        <SingleOrNestedListItem items={TWO_VALUES} label="Field" getContent={customGetContent} />,
      );

      const nestedItems = container.querySelectorAll("ul > li");
      expect(nestedItems[0].textContent).toBe("Custom: Value 1");
      expect(nestedItems[1].textContent).toBe("Custom: Value 2");
    });

    it("does not use additional props when rendering a single item", () => {
      const { container } = render(
        <SingleOrNestedListItem items={SINGLE_VALUE} label="Field" getContent={unusedGetContent} />,
      );

      const listItem = container.querySelector("li");
      expect(listItem?.textContent).toBe("Field: Single Value");
    });
  });

  describe("edge cases", () => {
    it("handles empty strings in items array", () => {
      const { container } = render(
        <SingleOrNestedListItem items={EMPTY_STRING_VALUE} label="Empty" />,
      );

      const listItem = container.querySelector("li");
      expect(listItem?.textContent).toBe("Empty: ");
    });

    it("handles special characters in label and values", () => {
      const { container } = render(
        <SingleOrNestedListItem items={SPECIAL_CHARACTERS_VALUE} label="Label <test>" />,
      );

      const listItem = container.querySelector("li");
      expect(listItem?.textContent).toBe("Label <test>: Value & Co.");
    });
  });
});
