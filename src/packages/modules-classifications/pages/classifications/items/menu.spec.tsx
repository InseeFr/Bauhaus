import { describe } from "vitest";

import { itBehavesLikeAReturnMenu } from "../../../testing/return-menu.testing";
import { Menu } from "./menu";

describe("<Controls /> (items)", () => {
  itBehavesLikeAReturnMenu(<Menu />, "items");
});
