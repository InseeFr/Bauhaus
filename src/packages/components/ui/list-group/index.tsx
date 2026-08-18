import { ComponentPropsWithoutRef, forwardRef } from "react";
import { cx } from "@utils/cx";

/**
 * Liste et éléments de liste de l'application.
 *
 * Le seul but de ces deux composants est de retenir les classes Bootstrap
 * (`list-group` / `list-group-item`) pour que les appelants n'aient plus à les
 * connaître : changer de socle CSS ne devra toucher que ce fichier.
 *
 * @example
 * <List.Container>
 *   {items.map((item) => (
 *     <List.Item key={item.id}>{item.label}</List.Item>
 *   ))}
 * </List.Container>
 */

const Container = ({ className, children, ...props }: ComponentPropsWithoutRef<"ul">) => (
  <ul className={cx("list-group", className)} {...props}>
    {children}
  </ul>
);
Container.displayName = "List.Container";

const Item = forwardRef<HTMLLIElement, ComponentPropsWithoutRef<"li">>(
  ({ className, children, ...props }, ref) => (
    <li ref={ref} className={cx("list-group-item", className)} {...props}>
      {children}
    </li>
  ),
);
Item.displayName = "List.Item";

export const List = { Container, Item };
