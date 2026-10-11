import { render } from "@testing-library/react";

import { List } from "./";

const STRING_ITEMS = ["item1", "item2", "item3"];
const NUMBER_ITEMS = [1, 2, 3];
const PERSON_ITEMS = [{ name: "John" }, { name: "Doe" }];
const FRUIT_ITEMS = ["apple", "banana", "cherry"];
const ID_ITEMS = ["id1", "id2", "id3"];
const TEST_ITEMS = ["test1", "test2"];
const NO_ITEMS: string[] = [];

const getPersonContent = (item: { name: string }) => `Name: ${item.name}`;
const getUpperCaseContent = (item: string) => item.toUpperCase();
const getPrefixedKey = (item: string) => `key-${item}`;
const getStrongContent = (item: string) => <strong>{item}</strong>;

describe("List Component", () => {
  it("renders list items based on provided items array with strings", () => {
    const { getByText } = render(<List<string> items={STRING_ITEMS} />);

    STRING_ITEMS.forEach((item) => {
      getByText(item);
    });
  });

  it("renders list items with numbers as primitives", () => {
    const { getByText } = render(<List<number> items={NUMBER_ITEMS} />);

    NUMBER_ITEMS.forEach((item) => {
      getByText(item.toString());
    });
  });

  it("renders custom content if getContent is provided with objects", () => {
    const { getByText } = render(<List items={PERSON_ITEMS} getContent={getPersonContent} />);

    PERSON_ITEMS.forEach((item) => {
      getByText(`Name: ${item.name}`);
    });
  });

  it("renders custom content with getContent for strings", () => {
    const { getByText } = render(
      <List<string> items={FRUIT_ITEMS} getContent={getUpperCaseContent} />,
    );

    getByText("APPLE");
    getByText("BANANA");
    getByText("CHERRY");
  });

  it("uses custom getKey function", () => {
    const { container } = render(<List<string> items={ID_ITEMS} getKey={getPrefixedKey} />);

    const listItems = container.querySelectorAll("li");
    // Note: React's 'key' prop is internal and not reflected in the DOM
    // We can only verify that the list renders correctly with 3 items
    expect(listItems).toHaveLength(3);
    expect(listItems[0].textContent).toBe("id1");
    expect(listItems[1].textContent).toBe("id2");
    expect(listItems[2].textContent).toBe("id3");
  });

  it("renders nothing if items array is empty", () => {
    const { container } = render(<List<string> items={NO_ITEMS} />);
    expect(container.querySelector("ul")).toBeNull();
  });

  it("renders nothing if items is undefined", () => {
    const { container } = render(<List<string> items={undefined as any} />);
    expect(container.querySelector("ul")).toBeNull();
  });

  it("renders JSX content when getContent returns ReactNode", () => {
    const { container } = render(<List<string> items={TEST_ITEMS} getContent={getStrongContent} />);

    const strongElements = container.querySelectorAll("strong");
    expect(strongElements).toHaveLength(2);
    expect(strongElements[0].textContent).toBe("test1");
    expect(strongElements[1].textContent).toBe("test2");
  });
});
