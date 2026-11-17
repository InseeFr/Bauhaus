import { ComponentPropsWithoutRef, forwardRef } from "react";

import { cx } from "@utils/cx";

import "./index.css";

/**
 * Liste et éléments de liste de l'application.
 *
 * Une liste simple (`ul` / `li`) habillée par `index.css` : les appelants ne
 * connaissent pas ses classes, changer d'habillage ne touche que ce dossier.
 *
 * @example
 * <List.Container>
 *   {items.map((item) => (
 *     <List.Item key={item.id}>{item.label}</List.Item>
 *   ))}
 * </List.Container>
 */

const Container = ({ className, children, ...props }: ComponentPropsWithoutRef<"ul">) => (
  <ul className={cx("bauhaus-list", className)} {...props}>
    {children}
  </ul>
);

Container.displayName = "List.Container";

const Item = forwardRef<HTMLLIElement, ComponentPropsWithoutRef<"li">>(
  ({ className, children, ...props }, ref) => (
    <li ref={ref} className={cx("bauhaus-list-item", className)} {...props}>
      {children}
    </li>
  ),
);

Item.displayName = "List.Item";

export const List = { Container, Item };
