# 10 améliorations — Performance & Lisibilité

> Audit du codebase **Bauhaus** (React 18.3 / TS 5.7 / Vite / TanStack Query / PrimeReact).
> Chaque proposition est ancrée sur des fichiers réels. Priorité : 🔴 forte · 🟠 moyenne · 🟢 faible.

---

## Performance

### 1. 🔴 Mémoïser les gros composants et leurs callbacks
**Constat** : un seul `React.memo` dans tout le `src/` (550 fichiers source), alors que des composants
lourds re-rendent à chaque changement de state parent.
- `physical-instances/pages/view/view.tsx` (833 lignes)
- `components/VariableEditForm/VariableEditForm.tsx` (547 lignes)
- `components/CodeRepresentation/CodeRepresentation.tsx` (434 lignes)

**Action** : envelopper ces composants dans `React.memo`, et stabiliser les callbacks passés en props
avec `useCallback` (81 `useCallback` / 42 `useMemo` existants — usage à généraliser sur les listes).

---

### 2. 🔴 Extraire les SVG inline de `buttons-with-icons.tsx`
**Constat** : `components/buttons/buttons-with-icons.tsx` redéfinit un `<svg>` complet **inline dans le JSX**
de chaque bouton (`UpdateButton`, `DeleteButton`, `ExportButton`…). Chaque icône est un nouvel objet React
à chaque render, et ~250 lignes sont du copier-coller.

**Action** : sortir chaque SVG en constante module (`const PencilIcon = (...)`) puis une fabrique
`createIconButton(icon, label)`. Gain : références stables + fichier divisé par ~3.

---

### 3. 🟠 Fusionner les chaînes de transformations dans `view.tsx`
**Constat** : `pages/view/view.tsx` enchaîne plusieurs passes O(n) sur le même tableau de variables
(construction d'une `Map`, suppression, mise à jour, puis `filter` recherche + `filter` type — ~lignes 182-232).

**Action** : regrouper en une passe (`reduce`) et **mémoïser** le résultat dérivé via `useMemo`
(dépendances : data + critères de filtre) pour ne pas recalculer à chaque frappe clavier.

---

### 4. 🟠 Garde `enabled` sur les requêtes TanStack Query paramétrées
**Constat** : des hooks lancent la requête même quand un paramètre obligatoire manque
(ex. `hooks/usePhysicalInstancesData.ts`, requête sur `agencyId`/`id`).

**Action** : ajouter `enabled: !!agencyId && !!id` aux `useQuery` concernés pour éviter les appels
réseau inutiles / 4xx au premier render.

---

### 5. 🟠 Stabiliser les templates de `DataTable` (PrimeReact)
**Constat** : dans `CodeRepresentation/CodeListDataTable.tsx`, les éditeurs de cellule
(`valueEditor`, `labelEditor`) sont des fonctions inline recréées à chaque render → le `DataTable`
re-rend toutes les lignes à chaque changement de state.

**Action** : extraire les `body`/`editor` templates en fonctions stables (`useCallback`) hors du flux de render.

---

## Lisibilité & Maintenabilité

### 6. 🔴 Découper les composants > 400 lignes
**Constat** : `view.tsx` (833) mélange data-fetching, état d'URL, filtres, et JSX profondément imbriqué.

**Action** : extraire `<VariableFilters>`, `<VariableTable>`, et la logique d'URL/effets dans des hooks
custom (`usePhysicalInstanceView`). Objectif : composants < 200 lignes, une responsabilité chacun.

---

### 7. 🔴 Réduire la dette `any` (334 occurrences / 118 fichiers)
**Constat** : `any` massif sur des props et données métier — ex. `searchable-list/index.tsx`
(`items: any[]`, `itemFormatter?: any`), `StructureComponentsSelector.tsx`
(`concepts: any`, `codesLists: any`, handlers `any`).

**Action** : typer en priorité les **frontières de props** des composants partagés.
Le projet a déjà des types générés (`physical-instances/types/generated/ddi.ts`) à réutiliser.

---

### 8. 🟠 Résorber les 12 `@ts-ignore`
**Constat** : 12 suppressions, surtout sur des imports de libs (dayjs plugins dans `utils/date-utils.ts`,
draft-js dans `rich-editor/`).

**Action** : installer les `@types/*` manquants ou ajouter des déclarations `*.d.ts` ciblées, puis
remplacer `@ts-ignore` par `@ts-expect-error` (échoue si l'erreur disparaît → auto-nettoyage).

---

### 9. 🟠 Factoriser les handlers dupliqués de `StructureComponentsSelector.tsx`
**Constat** : `removeClickHandler`, `specificationClickHandler`, `seeClickHandler`, `goingUp/goingDown`
répètent tous le même motif `e.target.parentElement.dataset.componentId` → find → dispatch.

**Action** : extraire un helper `getComponentIdFromEvent(e)` + un handler générique paramétré par l'action.
Réduit le bruit et le risque d'incohérence.

---

### 10. 🟢 Nettoyer le code mort et standardiser les imports
**Constat** :
- Code commenté (ex. plugin CSP commenté dans `vite.config.ts`).
- Mélange d'imports relatifs profonds (`../../../`) et d'alias (`@components/`, `@utils/`).

**Action** : `knip` est déjà dans les scripts — l'exploiter pour traquer exports/déps inutilisés ;
imposer les alias `@` via une règle lint pour les imports inter-modules.

---

## Synthèse priorisée

| # | Amélioration | Type | Priorité | Effort |
|---|--------------|------|----------|--------|
| 1 | `React.memo` + `useCallback` gros composants | Perf | 🔴 | M |
| 2 | Fabrique d'icônes (SVG hors render) | Perf | 🔴 | S |
| 3 | Fusion + `useMemo` des filtres `view.tsx` | Perf | 🟠 | M |
| 4 | Garde `enabled` sur les `useQuery` | Perf | 🟠 | S |
| 5 | Templates `DataTable` stables | Perf | 🟠 | S |
| 6 | Découpe des composants > 400 lignes | Lisibilité | 🔴 | L |
| 7 | Typage des frontières (`any` → types) | Lisibilité | 🔴 | L |
| 8 | Résorption des `@ts-ignore` | Lisibilité | 🟠 | M |
| 9 | Factorisation handlers dupliqués | Lisibilité | 🟠 | S |
| 10 | Code mort + imports normalisés | Lisibilité | 🟢 | S |

**Quick wins** (faible effort, fort impact) : #2, #4, #5, #9.
