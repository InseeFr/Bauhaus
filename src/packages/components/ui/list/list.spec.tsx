import { render } from "@testing-library/react";

import { List } from "./";

describe("List Component", () => {
  it("renders list items based on provided items array with strings", () => {
    const items = ["item1", "item2", "item3"];
    const { getByText } = render(<List<string> items={items} />);

    items.forEach((item) => {
      getByText(item);
    });
  });

  it("renders list items with numbers as primitives", () => {
    const items = [1, 2, 3];
    const { getByText } = render(<List<number> items={items} />);

    items.forEach((item) => {
      getByText(item.toString());
    });
  });

  it("renders custom content if getContent is provided with objects", () => {
    const items = [{ name: "John" }, { name: "Doe" }];
    const getContent = (item: { name: string }) => `Name: ${item.name}`;
    const { getByText } = render(<List items={items} getContent={getContent} />);

    items.forEach((item) => {
      getByText(`Name: ${item.name}`);
    });
  });

  it("renders custom content with getContent for strings", () => {
    const items = ["apple", "banana", "cherry"];
    const getContent = (item: string) => item.toUpperCase();
    const { getByText } = render(<List<string> items={items} getContent={getContent} />);

    getByText("APPLE");
    getByText("BANANA");
    getByText("CHERRY");
  });

  it("uses custom getKey function", () => {
    const items = ["id1", "id2", "id3"];
    const getKey = (item: string) => `key-${item}`;
    const { container } = render(<List<string> items={items} getKey={getKey} />);

    const listItems = container.querySelectorAll("li");
    // Note: React's 'key' prop is internal and not reflected in the DOM
    // We can only verify that the list renders correctly with 3 items
    expect(listItems).toHaveLength(3);
    expect(listItems[0].textContent).toBe("id1");
    expect(listItems[1].textContent).toBe("id2");
    expect(listItems[2].textContent).toBe("id3");
  });

  it("renders nothing if items array is empty", () => {
    const { container } = render(<List<string> items={[]} />);
    expect(container.querySelector("ul")).toBeNull();
  });

  it("renders nothing if items is undefined", () => {
    const { container } = render(<List<string> items={undefined as any} />);
    expect(container.querySelector("ul")).toBeNull();
  });

  it("renders JSX content when getContent returns ReactNode", () => {
    const items = ["test1", "test2"];
    const getContent = (item: string) => <strong>{item}</strong>;
    const { container } = render(<List<string> items={items} getContent={getContent} />);

    const strongElements = container.querySelectorAll("strong");
    expect(strongElements).toHaveLength(2);
    expect(strongElements[0].textContent).toBe("test1");
    expect(strongElements[1].textContent).toBe("test2");
  });
});
