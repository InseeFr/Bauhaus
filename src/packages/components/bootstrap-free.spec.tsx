import { screen } from "@testing-library/react";

import { BOTH, DOCUMENT } from "../constants/documentType";
import { renderWithAppContext } from "../tests/render";
import { CheckSecondLang } from "./check-second-lang";
import { ExplanatoryNote } from "./explanatory-note";
import { FilterToggleButtons } from "./filter-toggle-buttons";
import { NumberInput, TextInput, UrlInput } from "./form/input";
import { HomePageLayout } from "./home-page-layout";
import { InputRmes } from "./input-rmes";
import { Column, Row } from "./layout";
import { ModalRmes } from "./modal-rmes/modal-rmes";
import { FeminineButton, MasculineButton } from "./new-button";
import { Note } from "./note";
import { CompareNotes } from "./note-compare";
import { NoteEdition } from "./note-edition";
import { PageSubtitle } from "./page-sub-title";
import { PageTitle } from "./page-title";
import { PageTitleBlock } from "./page-title-block";
import { Pagination } from "./pagination";
import { InputMulti } from "./ui/forms/input-multi";
import { VerticalMenu } from "./vertical-menu";

// Mêmes classes que la commande de contrôle du chantier B, lues sur le DOM rendu.
const BOOTSTRAP_CLASS =
  /^(row|col-(xs|sm|md|lg)-((offset|push|pull)-)?\d+|pull-(left|right)|btn(-[a-z]+)?|form-group|form-control|glyphicon(-[a-z-]+)?|panel(-[a-z]+)?|list-group(-[a-z]+)?)$/;

const bootstrapClassesIn = (root: ParentNode) =>
  [...root.querySelectorAll("[class]")].flatMap((el) =>
    [...el.classList].filter((token) => BOOTSTRAP_CLASS.test(token)),
  );

const expectNoBootstrapClass = () => expect(bootstrapClassesIn(document.body)).toEqual([]);

const NOOP = () => {};
const NOTES = { 1: {}, 2: {} };
const buildNotes = () => [{ lg1: "noteLg1", lg2: "noteLg2", title: "title" }];
const NO_ERRORS = { errorMessage: [], fields: {} };
const ITEMS = Array.from({ length: 30 }, (_, i) => <li key={i}>Item {i + 1}</li>);

describe("composants partagés sans classe Bootstrap", () => {
  it("CheckSecondLang", () => {
    renderWithAppContext(<CheckSecondLang />);
    expectNoBootstrapClass();
  });

  it("ExplanatoryNote, vide, seule ou à côté d'une autre", () => {
    renderWithAppContext(
      <>
        <ExplanatoryNote title="vide" />
        <ExplanatoryNote title="seule" text="texte" alone />
        <ExplanatoryNote title="à côté" text="texte" />
      </>,
    );
    expectNoBootstrapClass();
  });

  it("FilterToggleButtons", () => {
    renderWithAppContext(
      <FilterToggleButtons
        options={[
          [BOTH, "Tous"],
          [DOCUMENT, "Documents"],
        ]}
        currentValue={BOTH}
        handleSelection={NOOP}
      />,
    );
    expectNoBootstrapClass();
  });

  it("champs texte, URL et nombre", () => {
    renderWithAppContext(
      <>
        <TextInput />
        <UrlInput />
        <NumberInput />
      </>,
    );
    expectNoBootstrapClass();
  });

  it("HomePageLayout", () => {
    renderWithAppContext(
      <HomePageLayout
        title="Accueil"
        menu={<VerticalMenu>{[<span key="a">a</span>]}</VerticalMenu>}
      >
        <p>Liste</p>
      </HomePageLayout>,
    );
    expectNoBootstrapClass();
  });

  it("InputRmes", () => {
    renderWithAppContext(<InputRmes label="Libellé" value="" handleChange={NOOP} colMd={6} />);
    expectNoBootstrapClass();
  });

  it("Row et Column", () => {
    renderWithAppContext(
      <Row>
        <Column>a</Column>
      </Row>,
    );
    expectNoBootstrapClass();
  });

  it("ModalRmes", () => {
    renderWithAppContext(
      <ModalRmes
        isOpen
        title="Confirmation"
        closeCancel={NOOP}
        modalButtons={[
          { label: "Annuler", action: NOOP, style: "default", disabled: false },
          { label: "Valider", action: NOOP, style: "primary", disabled: false },
        ]}
      />,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expectNoBootstrapClass();
  });

  it("boutons de création, lien ou bouton", () => {
    renderWithAppContext(
      <>
        <MasculineButton action="/create" />
        <FeminineButton action={NOOP} component="button" />
      </>,
    );
    expectNoBootstrapClass();
  });

  it("Note, seule ou à côté d'une autre", () => {
    renderWithAppContext(
      <>
        <Note title="seule" text="texte" alone />
        <Note title="à côté" text="texte" />
      </>,
    );
    expectNoBootstrapClass();
  });

  it("CompareNotes", () => {
    renderWithAppContext(
      <CompareNotes notes={NOTES} secondLang={false} version={2} buildNotes={buildNotes} />,
    );
    expectNoBootstrapClass();
  });

  it("NoteEdition", () => {
    renderWithAppContext(
      <NoteEdition
        notes={{ scopeNoteLg1: "a", scopeNoteLg2: "b", definitionLg1: "c" }}
        noteLg1Name="scopeNoteLg1"
        noteLg2Name="scopeNoteLg2"
        handleChangeLg1={NOOP}
        handleChangeLg2={NOOP}
        maxLength={350}
        errorMessage={NO_ERRORS}
      />,
    );
    expectNoBootstrapClass();
  });

  it("PageSubtitle", () => {
    renderWithAppContext(<PageSubtitle subTitle="Sous-titre" />);
    expectNoBootstrapClass();
  });

  it("PageTitle, centré ou pleine largeur", () => {
    renderWithAppContext(
      <>
        <PageTitle title="centré" />
        <PageTitle title="pleine largeur" col={12} offset={0} />
      </>,
    );
    expectNoBootstrapClass();
  });

  it("PageTitleBlock", () => {
    renderWithAppContext(<PageTitleBlock titleLg1="Titre" />);
    expectNoBootstrapClass();
  });

  it("Pagination", () => {
    renderWithAppContext(<Pagination itemEls={ITEMS} />);
    expectNoBootstrapClass();
  });

  it("InputMulti, une ou deux langues", () => {
    renderWithAppContext(
      <>
        <InputMulti inputLg1={[]} labelLg1="Une langue" handleChangeLg1={NOOP} />
        <InputMulti
          inputLg1={[]}
          inputLg2={[]}
          labelLg1="Langue 1"
          labelLg2="Langue 2"
          handleChangeLg1={NOOP}
          handleChangeLg2={NOOP}
        />
      </>,
    );
    expectNoBootstrapClass();
  });

  it("VerticalMenu", () => {
    renderWithAppContext(<VerticalMenu>{[<span key="a">a</span>]}</VerticalMenu>);
    expectNoBootstrapClass();
  });
});
