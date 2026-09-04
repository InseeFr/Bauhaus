import { getLang } from "./dictionary";

test(`should return fr when we passe fr as a paremeter`, () => {
  expect(getLang("fr")).toBe("fr");
});

test(`should return fr when we passe fr-FR as a paremeter`, () => {
  expect(getLang("fr-FR")).toBe("fr");
});
