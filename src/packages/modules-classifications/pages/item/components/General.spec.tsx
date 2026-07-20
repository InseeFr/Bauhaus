import { render, screen } from "@testing-library/react";

import General from "./General";

const general = {};

const renderGeneral = (props = {}) =>
  render(<General general={props} classificationId="id" secondLang={false} />);

describe("classification-level-general", () => {
  it("renders without crashing", () => {
    renderGeneral(general);
  });

  it("affiche le statut de publication 'Published' quand validationState est Validated", () => {
    renderGeneral({ validationState: "Validated" });
    expect(screen.getByText(/Published/)).toBeInTheDocument();
  });

  it("affiche le statut de publication 'Provisional' quand validationState est Unpublished", () => {
    renderGeneral({ validationState: "Unpublished" });
    expect(screen.getByText(/Provisional/)).toBeInTheDocument();
  });
});
