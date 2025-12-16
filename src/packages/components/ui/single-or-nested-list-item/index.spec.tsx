import { render, screen } from "@testing-library/react";
import { SingleOrNestedListItem } from "./index";

describe("SingleOrNestedListItem", () => {
  describe("when items array contains a single item", () => {
    it("renders a simple list item with label and value", () => {
      const { container } = render(
        <SingleOrNestedListItem items={["Single Value"]} label="Field" />,
      );

      const listItem = container.querySelector("li");
      expect(listItem).not.toBeNull();
      expect(listItem?.textContent).toBe("Field: Single Value");
    });

    it("formats the label and value with a colon separator", () => {
      const { container } = render(<SingleOrNestedListItem items={["Test"]} label="Label" />);

      const listItem = container.querySelector("li");
      expect(listItem?.textContent).toBe("Label: Test");
    });
  });

  describe("when items array contains multiple items", () => {
    it("renders a list item with a nested List component", () => {
      const { container } = render(
        <SingleOrNestedListItem items={["Value 1", "Value 2", "Value 3"]} label="Field" />,
      );

      const listItem = container.querySelector("li");
      expect(listItem).not.toBeNull();

      const nestedList = container.querySelector("ul");
      expect(nestedList).not.toBeNull();

      const nestedItems = container.querySelectorAll("ul > li");
      expect(nestedItems).toHaveLength(3);
    });

    it("displays the label followed by the nested list", () => {
      const { container } = render(
        <SingleOrNestedListItem items={["Item 1", "Item 2"]} label="Multiple Items" />,
      );

      const listItem = container.querySelector("li");
      expect(listItem?.textContent).toContain("Multiple Items:");
    });

    it("renders each item in the nested list", () => {
      const items = ["First", "Second", "Third"];
      const { container } = render(<SingleOrNestedListItem items={items} label="Items" />);

      const nestedItems = container.querySelectorAll("ul > li");
      expect(nestedItems[0].textContent).toBe("First");
      expect(nestedItems[1].textContent).toBe("Second");
      expect(nestedItems[2].textContent).toBe("Third");
    });
  });

  describe("when passing additional props", () => {
    it("forwards props to the List component when rendering multiple items", () => {
      const customGetContent = (value: string) => `Custom: ${value}`;
      const { container } = render(
        <SingleOrNestedListItem
          items={["Value 1", "Value 2"]}
          label="Field"
          getContent={customGetContent}
        />,
      );

      const nestedItems = container.querySelectorAll("ul > li");
      expect(nestedItems[0].textContent).toBe("Custom: Value 1");
      expect(nestedItems[1].textContent).toBe("Custom: Value 2");
    });

    it("does not use additional props when rendering a single item", () => {
      const customGetContent = () => "Should not be used";
      const { container } = render(
        <SingleOrNestedListItem
          items={["Single Value"]}
          label="Field"
          getContent={customGetContent}
        />,
      );

      const listItem = container.querySelector("li");
      expect(listItem?.textContent).toBe("Field: Single Value");
    });
  });

  describe("edge cases", () => {
    it("handles empty strings in items array", () => {
      const { container } = render(<SingleOrNestedListItem items={[""]} label="Empty" />);

      const listItem = container.querySelector("li");
      expect(listItem?.textContent).toBe("Empty: ");
    });

    it("handles special characters in label and values", () => {
      const { container } = render(
        <SingleOrNestedListItem items={["Value & Co."]} label="Label <test>" />,
      );

      const listItem = container.querySelector("li");
      expect(listItem?.textContent).toBe("Label <test>: Value & Co.");
    });
  });
});
