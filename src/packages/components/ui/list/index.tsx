import { ReactNode } from "react";

interface ListTypes<T> {
  items: T[];
  getContent?: (value: T) => string | ReactNode;
  getKey?: (value: T) => string;
}

export const List = <T,>({
  items,
  getContent = (value: T) => String(value),
  getKey = (value: T) => String(value),
}: Readonly<ListTypes<T>>) => {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <ul>
      {items.map((item) => (
        <li key={getKey(item)}>{getContent(item)}</li>
      ))}
    </ul>
  );
};
