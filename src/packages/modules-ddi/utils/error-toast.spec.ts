import { errorToastTiming } from "./error-toast";

describe("errorToastTiming", () => {
  it("garde l'erreur affichée jusqu'à fermeture quand aucune durée n'est configurée", () => {
    expect(errorToastTiming(undefined)).toEqual({ sticky: true });
    expect(errorToastTiming("")).toEqual({ sticky: true });
  });

  it("garde l'erreur affichée jusqu'à fermeture quand la durée vaut 0", () => {
    expect(errorToastTiming("0")).toEqual({ sticky: true });
  });

  it("masque l'erreur après la durée configurée en millisecondes", () => {
    expect(errorToastTiming("15000")).toEqual({ life: 15000 });
  });

  it("ignore une durée invalide et garde l'erreur affichée", () => {
    expect(errorToastTiming("dix secondes")).toEqual({ sticky: true });
    expect(errorToastTiming("-5")).toEqual({ sticky: true });
  });
});
