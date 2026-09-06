import { createDictionary, firstLang, secondLang } from "@utils/dictionnary";

import messages from "./errors";

type ErrorMessage = (payload: Record<string, string>) => string;

const entries = Object.entries(messages.errors) as [string, { fr: unknown; en: unknown }][];

/** Charge utile passée par `ErrorBloc` : l'erreur analysée, dont les messages tirent leurs valeurs. */
const parsedError = { idConcept: "c1000", id: "1", code: "0", message: "" };

describe("dictionnaire des messages d'erreur", () => {
  it("contient des messages", () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it.each(entries)(
    "%s expose un message français et anglais appelable avec l'erreur analysée",
    (_code, message) => {
      expect(message.fr).toBeTypeOf("function");
      expect(message.en).toBeTypeOf("function");
      expect((message.fr as ErrorMessage)(parsedError)).toBeTruthy();
      expect((message.en as ErrorMessage)(parsedError)).toBeTruthy();
    },
  );

  it("interpole l'identifiant du concept dans les messages qui le mentionnent", () => {
    const message = messages.errors[111] as { fr: ErrorMessage; en: ErrorMessage };

    expect(message.fr(parsedError)).toContain("c1000");
    expect(message.en(parsedError)).toContain("c1000");
  });

  it("est indexé par le dictionnaire de la langue courante", () => {
    const D1 = createDictionary(firstLang, messages);
    const D2 = createDictionary(secondLang, messages);
    const [code, message] = entries[0];

    expect(D1.errors[code](parsedError)).toBe((message.fr as ErrorMessage)(parsedError));
    expect(D2.errors[code](parsedError)).toBe((message.en as ErrorMessage)(parsedError));
  });
});
