import { EMPTY_ARRAY } from "@utils/array-utils";

import { Row } from "../layout";
import "./index.css";

export const VerticalMenu = ({ children = EMPTY_ARRAY }: Readonly<{ children: unknown }>) => {
  const buttons = Array.isArray(children) ? children : [children];

  return (
    <div className="bauhaus-grid-md-3 bauhaus-vertical-menu">
      {buttons.map((child, index) => (
        <Row key={index}>
          <div className="bauhaus-grid-md-12">{child}</div>
        </Row>
      ))}
    </div>
  );
};
