import { render } from "@testing-library/react";

import { expectNoLegacyGridClass } from "../../tests/grid-classes.testing";
import { renderWithAppContext } from "../../tests/render";
import { CheckSecondLang } from "../check-second-lang";
import { ExplanatoryNote } from "../explanatory-note";
import { HomePageLayout } from "../home-page-layout";
import { InputRmes } from "../input-rmes";
import { Note } from "../note";
import { CompareNotes } from "../note-compare";
import { NoteEdition } from "../note-edition";
import { PageSubtitle } from "../page-sub-title";
import { PageTitle } from "../page-title";
import { PageTitleBlock } from "../page-title-block";
import { InputMulti } from "../ui/forms/input-multi";
import { VerticalMenu } from "../vertical-menu";

import { Column, Row } from ".";

const noInputs: string[] = [];
const comparedNotes = { 1: {}, 2: {} };
const buildNotes = () => [{ lg1: "a", lg2: "b", title: "t" }];
const editedNotes = { scopeNoteLg1: "a", scopeNoteLg2: "b", definitionLg1: "" };
const noErrors = { errorMessage: [], fields: {} };
const homePageMenu = <VerticalMenu>{[<button key="a">a</button>]}</VerticalMenu>;

describe("grille PrimeFlex", () => {
  it("Row rend une ligne de grille PrimeFlex", () => {
    const { container } = render(<Row className="extra" />);

    expect(container.firstElementChild).toHaveClass("grid", "extra");
    expectNoLegacyGridClass();
  });

  it("Column prend toute la largeur, puis la moitié à partir de 992px", () => {
    const { container } = render(<Column>contenu</Column>);

    expect(container.firstElementChild).toHaveClass("col-12", "lg:col-6");
    expectNoLegacyGridClass();
  });

  it.each([
    ["Note", <Note key="n" text="texte" title="titre" />],
    ["Note seule", <Note key="n" text="texte" title="titre" alone />],
    ["ExplanatoryNote", <ExplanatoryNote key="e" text="texte" title="titre" />],
    ["ExplanatoryNote vide", <ExplanatoryNote key="e" title="titre" alone />],
    ["InputRmes", <InputRmes key="i" value="" label="label" handleChange={vi.fn()} colMd={6} />],
    [
      "InputMulti",
      <InputMulti
        key="m"
        inputLg1={noInputs}
        inputLg2={noInputs}
        labelLg1="lg1"
        labelLg2="lg2"
        handleChangeLg1={vi.fn()}
        handleChangeLg2={vi.fn()}
      />,
    ],
    ["PageTitle", <PageTitle key="t" title="titre" />],
    ["PageTitleBlock", <PageTitleBlock key="b" titleLg1="titre" titleLg2="title" />],
    ["PageSubtitle", <PageSubtitle key="s" subTitle="sous-titre" />],
    ["VerticalMenu", <VerticalMenu key="v">{[<button key="a">a</button>]}</VerticalMenu>],
    ["CheckSecondLang", <CheckSecondLang key="c" />],
    [
      "CompareNotes",
      <CompareNotes
        key="cn"
        notes={comparedNotes}
        secondLang
        version={2}
        buildNotes={buildNotes}
      />,
    ],
    [
      "NoteEdition",
      <NoteEdition
        key="ne"
        notes={editedNotes}
        noteLg1Name="scopeNoteLg1"
        noteLg2Name="scopeNoteLg2"
        handleChangeLg1={vi.fn()}
        handleChangeLg2={vi.fn()}
        maxLength={0}
        errorMessage={noErrors}
      />,
    ],
    [
      "HomePageLayout",
      <HomePageLayout key="h" title="titre" menu={homePageMenu}>
        liste
      </HomePageLayout>,
    ],
  ])("%s ne pose aucune classe de l'ancienne grille", (_name, element) => {
    renderWithAppContext(element);

    expectNoLegacyGridClass();
  });
});
