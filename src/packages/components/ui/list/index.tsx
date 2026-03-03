import { ReactNode } from "react";

interface ListTypes<T> {
  items: T[];
  getContent?: (value: T) => string | ReactNode;
  getKey?: (value: T, index: number) => string;
}

export const List = <T,>({
  items,
  getContent = (value: T) => String(value),
  getKey = (value: T, index: number) => String(value) || `item-${index}`,
}: Readonly<ListTypes<T>>) => {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <ul>
      {items.map((item, index) => (
        <li key={getKey(item, index)}>{getContent(item)}</li>
      ))}
    </ul>
  );
};
