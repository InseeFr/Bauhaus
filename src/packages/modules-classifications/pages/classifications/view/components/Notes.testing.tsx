import { render } from "@testing-library/react";

import { Notes } from "./Notes";

export const renderNotes = (notes: any, secondLang = false) =>
  render(<Notes notes={notes} secondLang={secondLang} />);
