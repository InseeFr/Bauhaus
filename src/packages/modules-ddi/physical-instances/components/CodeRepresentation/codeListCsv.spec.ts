import { describe, expect, it } from "vitest";

import { MAX_CSV_IMPORT_ROWS, parseCodeListCsv } from "./codeListCsv";

describe("parseCodeListCsv", () => {
  it("lit les codes et leurs valeurs en ignorant la ligne d'en-tête, quelle qu'elle soit", () => {
    expect(parseCodeListCsv("n'importe quoi,peu importe\nFR,France\nDE,Germany")).toEqual({
      rows: [
        { code: "FR", value: "France" },
        { code: "DE", value: "Germany" },
      ],
      errors: [],
    });
  });

  it("accepte le point-virgule comme séparateur, détecté sur la ligne d'en-tête", () => {
    expect(parseCodeListCsv("CODE;VALUE\nFR;France, pays").rows).toEqual([
      { code: "FR", value: "France, pays" },
    ]);
  });

  it("retire les espaces de début et de fin en conservant les espaces internes et la casse", () => {
    expect(parseCodeListCsv("CODE,VALUE\n  fr  , République  française ").rows).toEqual([
      { code: "fr", value: "République  française" },
    ]);
  });

  it("ignore les lignes vides et les fins de ligne Windows", () => {
    expect(parseCodeListCsv("CODE,VALUE\r\n\r\nFR,France\r\n   \r\nDE,Germany\r\n")).toEqual({
      rows: [
        { code: "FR", value: "France" },
        { code: "DE", value: "Germany" },
      ],
      errors: [],
    });
  });

  it("ignore le BOM UTF-8 en tête de fichier", () => {
    expect(parseCodeListCsv("﻿CODE;VALUE\nFR;France").rows).toEqual([
      { code: "FR", value: "France" },
    ]);
  });

  it("applique les règles de guillemets CSV : séparateur, guillemet doublé et saut de ligne", () => {
    expect(
      parseCodeListCsv('CODE,VALUE\nFR,"France, métropole"\nUS,"Les ""States"""\nGB,"Royaume\nUni"')
        .rows,
    ).toEqual([
      { code: "FR", value: "France, métropole" },
      { code: "US", value: 'Les "States"' },
      { code: "GB", value: "Royaume\nUni" },
    ]);
  });

  it("signale un code ou une valeur vide avec son numéro de ligne dans le fichier", () => {
    expect(parseCodeListCsv("CODE,VALUE\n,France\n\nDE,  ").errors).toEqual([
      { line: 2, kind: "emptyCode" },
      { line: 4, kind: "emptyValue" },
    ]);
  });

  it("signale les lignes qui n'ont pas exactement deux colonnes", () => {
    expect(parseCodeListCsv("CODE,VALUE\nFR\nDE,Germany,Allemagne").errors).toEqual([
      { line: 2, kind: "invalidColumnCount" },
      { line: 3, kind: "invalidColumnCount" },
    ]);
  });

  it("signale un code en double sans tenir compte de la casse", () => {
    expect(parseCodeListCsv("CODE,VALUE\nFR,France\nfr,French Republic").errors).toEqual([
      { line: 3, kind: "duplicateCode", code: "fr" },
    ]);
  });

  it("numérote les lignes physiques même après un champ sur plusieurs lignes", () => {
    expect(parseCodeListCsv('CODE,VALUE\nGB,"Royaume\nUni"\n,France').errors).toEqual([
      { line: 4, kind: "emptyCode" },
    ]);
  });

  it("signale un guillemet jamais refermé", () => {
    expect(parseCodeListCsv('CODE,VALUE\nFR,"France').errors).toEqual([
      { line: 2, kind: "unclosedQuote" },
    ]);
  });

  it("rejette un fichier sans aucune ligne de données", () => {
    expect(parseCodeListCsv("CODE,VALUE\n\n").errors).toEqual([{ kind: "noData" }]);
  });

  it("rejette un fichier qui dépasse le nombre maximal de lignes de données", () => {
    const lines = Array.from({ length: MAX_CSV_IMPORT_ROWS + 1 }, (_, i) => `C${i},V${i}`);
    expect(parseCodeListCsv(["CODE,VALUE", ...lines].join("\n")).errors).toEqual([
      { kind: "tooManyRows", max: MAX_CSV_IMPORT_ROWS },
    ]);
  });

  it("accepte exactement le nombre maximal de lignes de données", () => {
    const lines = Array.from({ length: MAX_CSV_IMPORT_ROWS }, (_, i) => `C${i},V${i}`);
    const result = parseCodeListCsv(["CODE,VALUE", ...lines].join("\n"));
    expect(result.errors).toEqual([]);
    expect(result.rows).toHaveLength(MAX_CSV_IMPORT_ROWS);
  });
});
