import { draftjsToMd } from "./draftjsToMd";

const block = (overrides: Record<string, unknown> = {}) => ({
  type: "unstyled",
  depth: 0,
  text: "",
  inlineStyleRanges: [],
  entityRanges: [],
  ...overrides,
});

const raw = (blocks: unknown[], entityMap: Record<string, unknown> = {}) => ({
  blocks,
  entityMap,
});

describe("draftjsToMd", () => {
  it("rend le texte brut tel quel", () => {
    expect(draftjsToMd(raw([block({ text: "un texte" })]))).toBe("un texte");
  });

  it("joint les blocs par un retour à la ligne", () => {
    expect(draftjsToMd(raw([block({ text: "ligne 1" }), block({ text: "ligne 2" })]))).toBe(
      "ligne 1\nligne 2",
    );
  });

  describe("styles de bloc", () => {
    it.each([
      ["header-one", "# titre"],
      ["header-two", "## titre"],
      ["header-three", "### titre"],
      ["header-four", "#### titre"],
      ["header-five", "##### titre"],
      ["header-six", "###### titre"],
      ["blockquote", "> titre"],
      ["unordered-list-item", "- titre"],
    ])("préfixe un bloc %s", (type, expected) => {
      expect(draftjsToMd(raw([block({ type, text: "titre" })]))).toBe(expected);
    });

    it("numérote les items d'une liste ordonnée", () => {
      const blocks = [
        block({ type: "ordered-list-item", text: "un" }),
        block({ type: "ordered-list-item", text: "deux" }),
        block({ type: "ordered-list-item", text: "trois" }),
      ];
      expect(draftjsToMd(raw(blocks))).toBe("1. un\n2. deux\n3. trois");
    });

    it("ne compte que les items de liste dans la numérotation", () => {
      const blocks = [
        block({ text: "introduction" }),
        block({ type: "ordered-list-item", text: "un" }),
        block({ type: "ordered-list-item", text: "deux" }),
      ];
      expect(draftjsToMd(raw(blocks))).toBe("introduction\n1. un\n2. deux");
    });

    it("entoure un bloc de code de triples accents graves", () => {
      expect(draftjsToMd(raw([block({ type: "code-block", text: "const a = 1;" })]))).toBe(
        "```\nconst a = 1;\n```",
      );
    });
  });

  describe("styles en ligne", () => {
    it.each([
      ["BOLD", "__gras__"],
      ["ITALIC", "*gras*"],
      ["STRIKETHROUGH", "+gras+"],
    ])("entoure le texte du symbole de %s", (style, expected) => {
      const blocks = [
        block({ text: "gras", inlineStyleRanges: [{ offset: 0, length: 4, style }] }),
      ];
      expect(draftjsToMd(raw(blocks))).toBe(expected);
    });

    it("n'applique pas un style absent du dictionnaire", () => {
      const blocks = [
        block({
          text: "texte",
          inlineStyleRanges: [{ offset: 0, length: 5, style: "UNDERLINE" }],
        }),
      ];
      expect(draftjsToMd(raw(blocks))).toBe("texte");
    });

    it("accepte un dictionnaire de styles supplémentaire", () => {
      const blocks = [
        block({
          text: "souligné",
          inlineStyleRanges: [{ offset: 0, length: 8, style: "UNDERLINE" }],
        }),
      ];
      expect(draftjsToMd(raw(blocks), { UNDERLINE: "++" })).toBe("++souligné++");
    });

    it("conserve le style sur une portion du texte seulement", () => {
      const blocks = [
        block({
          text: "un mot gras",
          inlineStyleRanges: [{ offset: 7, length: 4, style: "BOLD" }],
        }),
      ];
      expect(draftjsToMd(raw(blocks))).toBe("un mot __gras__");
    });

    it("sort les espaces de fin hors des marqueurs de style", () => {
      const blocks = [
        block({
          text: "gras suite",
          inlineStyleRanges: [{ offset: 0, length: 5, style: "BOLD" }],
        }),
      ];
      expect(draftjsToMd(raw(blocks))).toBe("__gras__ suite");
    });

    it("émet le style de couleur tel quel comme marqueur", () => {
      const blocks = [
        block({
          text: "rouge",
          inlineStyleRanges: [{ offset: 0, length: 5, style: "color-rgb(255,0,0)" }],
        }),
      ];
      expect(draftjsToMd(raw(blocks))).toBe("color-rgb(255,0,0)rougecolor-rgb(255,0,0)");
    });

    it("gère les styles imbriqués en commençant par le plus long", () => {
      const blocks = [
        block({
          text: "gras et italique",
          inlineStyleRanges: [
            { offset: 0, length: 16, style: "BOLD" },
            { offset: 0, length: 4, style: "ITALIC" },
          ],
        }),
      ];
      expect(draftjsToMd(raw(blocks))).toBe("__*gras* et italique__");
    });
  });

  describe("entités", () => {
    it("entoure le texte d'un lien markdown", () => {
      const blocks = [block({ text: "Insee", entityRanges: [{ offset: 0, length: 5, key: "0" }] })];
      const entityMap = { 0: { type: " LINK", data: { url: "https://insee.fr" } } };
      expect(draftjsToMd(raw(blocks, entityMap))).toBe("[Insee](https://insee.fr)");
    });

    it("laisse le texte intact pour une entité d'un autre type", () => {
      const blocks = [block({ text: "Insee", entityRanges: [{ offset: 0, length: 5, key: "0" }] })];
      const entityMap = { 0: { type: "TOKEN", data: { url: "https://insee.fr" } } };
      expect(draftjsToMd(raw(blocks, entityMap))).toBe("Insee");
    });

    it("rend un bloc atomique image avec son nom de fichier", () => {
      const blocks = [
        block({ type: "atomic", text: " ", entityRanges: [{ offset: 0, length: 1, key: "0" }] }),
      ];
      const entityMap = {
        0: { type: "IMAGE", data: { url: "https://insee.fr/logo.png", fileName: "logo" } },
      };
      expect(draftjsToMd(raw(blocks, entityMap))).toBe("![logo](https://insee.fr/logo.png)");
    });

    it("se rabat sur src et un nom de fichier vide pour une image", () => {
      const blocks = [
        block({ type: "atomic", text: " ", entityRanges: [{ offset: 0, length: 1, key: "0" }] }),
      ];
      const entityMap = { 0: { type: "IMAGE", data: { src: "https://insee.fr/logo.png" } } };
      expect(draftjsToMd(raw(blocks, entityMap))).toBe("![](https://insee.fr/logo.png)");
    });

    it("rend un bloc atomique vidéo sous forme d'embed", () => {
      const blocks = [
        block({ type: "atomic", text: " ", entityRanges: [{ offset: 0, length: 1, key: "0" }] }),
      ];
      const entityMap = {
        0: {
          type: "draft-js-video-plugin-video",
          data: { url: "https://insee.fr/video.mp4" },
        },
      };
      expect(draftjsToMd(raw(blocks, entityMap))).toBe(
        "[[ embed url=https://insee.fr/video.mp4 ]]",
      );
    });
  });
});
