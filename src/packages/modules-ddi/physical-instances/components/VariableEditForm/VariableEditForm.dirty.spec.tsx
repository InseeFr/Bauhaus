import { render } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { usePrivileges, useUserStamps } from "@utils/hooks/users";

import { ddiPrivileges } from "../../../privileges.testing";
import type { TextRepresentation } from "../../types/api";
import { VariableEditForm } from "./VariableEditForm";
import { searchParamsMock, typeOptions } from "./variableForm.testing";

vi.mock(
  "react-router",
  async () => (await import("./variableForm.testing")).searchParamsRouterModule,
);

vi.mock("react-i18next", async () =>
  (await import("../representation.testing")).mockTranslations({}),
);

vi.mock("@utils/hooks/users", async (importOriginal) =>
  (await import("../../../privileges.testing")).mockUsersHooks(importOriginal),
);

vi.mock("./VariableInformationTab", () => ({
  VariableInformationTab: () => <div>contenu informations</div>,
}));
vi.mock("../SentinelValues/SentinelValues", () => ({
  SentinelValues: () => <div>valeurs sentinelles</div>,
}));
vi.mock("./DdiPreview", () => ({ DdiPreview: () => <div>contenu aperçu</div> }));

const REPRESENTATION_TAB = "1";

const textVariable = (id: string, textRepresentation?: TextRepresentation) => ({
  id,
  label: `Variable ${id}`,
  name: id.toUpperCase(),
  type: "text",
  textRepresentation,
});

describe("VariableEditForm, variable Text ouverte sur l'onglet Représentation", () => {
  beforeEach(() => {
    vi.mocked(usePrivileges).mockReturnValue(ddiPrivileges("UPDATE", "ALL") as any);
    vi.mocked(useUserStamps).mockReturnValue({ data: [{ stamp: "STAMP1" }] } as any);
    searchParamsMock.reset();
    searchParamsMock.current.set("tab", REPRESENTATION_TAB);
  });

  it.each([
    ["sans représentation relue", undefined],
    ["avec une représentation vide", {} as TextRepresentation],
    ["avec une représentation typée", { $type: "TextRepresentationBaseType", MaxLength: 100 }],
    [
      "avec des attributs relus dans un autre ordre",
      { $type: "TextRepresentationBaseType", RegExp: ".*", MaxLength: 100, MinLength: 2 },
    ],
  ] as [string, TextRepresentation | undefined][])(
    "n'est pas modifiée tant que rien n'est saisi (%s)",
    (_, textRepresentation) => {
      const onDirtyChange = vi.fn();
      const onSave = vi.fn();
      const { rerender } = render(
        <VariableEditForm
          variable={textVariable("var-1", { $type: "TextRepresentationBaseType", MaxLength: 5 })}
          typeOptions={typeOptions}
          onSave={onSave}
          onDirtyChange={onDirtyChange}
        />,
      );

      rerender(
        <VariableEditForm
          variable={textVariable("var-2", textRepresentation)}
          typeOptions={typeOptions}
          onSave={onSave}
          onDirtyChange={onDirtyChange}
        />,
      );

      expect(onDirtyChange).toHaveBeenLastCalledWith(false);
      expect(onSave).not.toHaveBeenCalled();
    },
  );

  it("ne passe jamais, même un instant, pour modifiée au changement de variable", () => {
    const onDirtyChange = vi.fn();
    const { rerender } = render(
      <VariableEditForm
        variable={textVariable("var-1", { $type: "TextRepresentationBaseType", MaxLength: 5 })}
        typeOptions={typeOptions}
        onSave={vi.fn()}
        onDirtyChange={onDirtyChange}
      />,
    );

    rerender(
      <VariableEditForm
        variable={textVariable("var-2")}
        typeOptions={typeOptions}
        onSave={vi.fn()}
        onDirtyChange={onDirtyChange}
      />,
    );

    expect(onDirtyChange).not.toHaveBeenCalledWith(true);
  });
});
