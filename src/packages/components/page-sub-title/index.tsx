import { Row } from "../layout";
import "./index.css";

export const PageSubtitle = ({ subTitle }: Readonly<{ subTitle: string }>) => {
  return (
    <Row>
      <div className="bauhaus-grid-md-8 bauhaus-grid-md-offset-2 text-center">
        <h3 className="wilco-page-subtitle">{subTitle}</h3>
      </div>
    </Row>
  );
};
