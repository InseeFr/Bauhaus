import {ComponentProps} from "react";
import {List} from "../list";

/**
 * A component that renders a list item with either a single value or a nested list.
 *
 * @param props.items - The array of items to display
 * @param props.label - The label to display before the item(s)
 *
 * @returns A list item element containing either:
 *   - A single line with "label: value" when items.length === 1
 *   - A label followed by a nested List component when items.length > 1
 *
 * @example
 * // Single item
 * <SingleOrNestedListItem items={["Value"]} label="Field" />
 * // Renders: <li>Field: Value</li>
 *
 * @example
 * // Multiple items
 * <SingleOrNestedListItem items={["Value 1", "Value 2", "Value 3"]} label="Field" />
 * // Renders: <li>Field: <List items={["Value 1", "Value 2", "Value 3"]} /></li>
 */
export const SingleOrNestedListItem = ({ items, label, ...props }: Readonly<ComponentProps<typeof List> & { label: string }>) => {
        if (items.length === 1) {
            return <li>{`${label}: ${items[0]}`}</li>;
        }

        return (
            <li>
                {label}:
                <List {...props} items={items} />
            </li>
        );
}