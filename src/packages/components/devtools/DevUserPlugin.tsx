import { useQueryClient } from "@tanstack/react-query";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { useState } from "react";

import { clearDevUser, loadDevUser, saveDevUser } from "@sdk/dev-user";

import { useStampsOptions, useV2Stamps } from "@utils/hooks/stamps";

/** Rôles déclarés dans le rbac.yml du back. */
const ROLES = [
  "Administrateur_RMESGNCS",
  "Betatest_OeDDIp_RMESGNCS",
  "Gestionnaire_concept_RMESGNCS",
  "Gestionnaire_ensemble_concepts_RMESGNCS",
  "Gestionnaire_indicateur_RMESGNCS",
  "Gestionnaire_jeu_donnees_RMESGNCS",
  "Gestionnaire_liste_codes_RMESGNCS",
  "Gestionnaire_serie_RMESGNCS",
  "Gestionnaire_structures_RMESGNCS",
  "Gestionnaire_variables_RMESGNCS",
  "Proprietaire_collection_concepts_RMESGNCS",
  "Proprietaire_concept_RMESGNCS",
  "Utilisateur_RMESGNCS",
];

const SOURCES = [
  { value: "insee", label: "insee" },
  { value: "ssm", label: "ssm" },
];

/** Timbres DG75/SSM (/stamps) puis timbres HIE des organisations (/v2/stamps). */
const useAllStampsOptions = () => {
  const legacy = useStampsOptions();
  const { data = [] } = useV2Stamps();
  const organisations = data.map(({ stamp, label }) => ({
    value: stamp,
    label: `${stamp} - ${label}`,
  }));
  return [...legacy, ...organisations];
};

const fieldStyle = { display: "flex", flexDirection: "column", gap: "0.25rem" } as const;

// Les panneaux restent dans le plugin (appendTo="self") : sans ces bornes, ils prennent la largeur
// du plus long libellé et débordent hors de l'onglet, qui masque ce qui dépasse.
// position: relative est déjà sur .p-dropdown mais pas sur .p-multiselect : sans elle, le panneau
// des rôles se cale sur un ancêtre plus large que le champ.
const selectStyle = { width: "100%", maxWidth: "100%", position: "relative" } as const;
const panelStyle = { maxWidth: "100%" } as const;
const wrappingItem = { style: { whiteSpace: "normal", overflowWrap: "anywhere" } } as const;

/**
 * Remplace, pour la session du navigateur, les rôles, timbres et source de l'utilisateur fictif
 * du back. Les droits et les listes sont recalculés par le back, comme pour un vrai jeton.
 */
export const DevUserPlugin = () => {
  const queryClient = useQueryClient();
  const stampOptions = useAllStampsOptions();
  const initial = loadDevUser();
  const [roles, setRoles] = useState<string[]>(initial?.roles ?? []);
  const [stamp, setStamp] = useState(initial?.stamps[0] ?? "");
  const [source, setSource] = useState(initial?.source ?? "");

  const apply = () => {
    saveDevUser({ roles, stamps: stamp ? [stamp] : [], source });
    void queryClient.invalidateQueries();
  };

  const reset = () => {
    clearDevUser();
    setRoles([]);
    setStamp("");
    setSource("");
    void queryClient.invalidateQueries();
  };

  return (
    <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2>Utilisateur simulé</h2>
      <p style={{ color: "#666", fontSize: "0.9em" }}>
        Hors PROD uniquement. Un champ vide garde la valeur configurée côté back
        (fr.insee.rmes.bauhaus.dev-user.*).
      </p>
      <div style={fieldStyle}>
        <label htmlFor="dev-user-roles">Rôles</label>
        <MultiSelect
          inputId="dev-user-roles"
          value={roles}
          options={ROLES}
          onChange={(e) => setRoles(e.value)}
          display="chip"
          filter
          filterPlaceholder="Rechercher un rôle"
          pt={{
            filterInput: { "aria-label": "Rechercher un rôle" },
            label: {
              style: { display: "flex", flexWrap: "wrap", gap: "0.25rem", whiteSpace: "normal" },
            },
            item: wrappingItem,
          }}
          placeholder="(configurés côté back)"
          appendTo="self"
          style={selectStyle}
          panelStyle={panelStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="dev-user-stamp">Timbre</label>
        <Dropdown
          inputId="dev-user-stamp"
          value={stamp}
          options={stampOptions}
          onChange={(e) => setStamp(e.value ?? "")}
          filter
          filterPlaceholder="Rechercher un timbre"
          pt={{ filterInput: { "aria-label": "Rechercher un timbre" }, item: wrappingItem }}
          showClear
          placeholder="(configuré côté back)"
          appendTo="self"
          style={selectStyle}
          panelStyle={panelStyle}
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="dev-user-source">Source</label>
        <Dropdown
          inputId="dev-user-source"
          value={source}
          options={SOURCES}
          onChange={(e) => setSource(e.value ?? "")}
          showClear
          placeholder="(configurée côté back)"
          appendTo="self"
          style={selectStyle}
          panelStyle={panelStyle}
        />
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button type="button" onClick={apply}>
          Appliquer
        </button>
        <button type="button" onClick={reset}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
};
