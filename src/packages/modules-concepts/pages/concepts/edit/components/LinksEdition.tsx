import { PickList } from "primereact/picklist";
import { TabPanel, TabView, TabViewTabChangeEvent } from "primereact/tabview";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { BROADER, CLOSE_MATCH, NARROWER, NONE, REFERENCES, RELATED, SUCCEED } from "@sdk/constants";

import { Link } from "../../../../../model/concepts/concept";
import { EquivalentLinks } from "./EquivalentLinks";

type LinkType = string;

interface LinkTypeDefinition {
  title: string;
  memberType: LinkType;
}

export interface ConceptWithLink {
  id: string;
  label: string;
  typeOfLink: LinkType;
  prefLabelLg1?: string;
  prefLabelLg2?: string;
}

interface LinksEditionProps {
  conceptsWithLinks: ConceptWithLink[];
  currentId?: string;
  handleChange: (conceptsWithLinks: ConceptWithLink[]) => void;
  equivalentLinks: (Link & { urn: string })[];
  handleChangeEquivalentLinks: (links: (Link | { urn: string })[]) => void;
}

// Les intitulés des onglets restent en français quelle que soit la langue de
// l'utilisateur : ce sont les termes du thésaurus.
const LINK_TYPES: { titleKey: string; memberType: LinkType }[] = [
  { titleKey: "concept.links.narrowerTitle", memberType: NARROWER },
  { titleKey: "concept.links.broaderTitle", memberType: BROADER },
  { titleKey: "concept.links.referencesTitle", memberType: REFERENCES },
  { titleKey: "concept.links.replacesTitle", memberType: SUCCEED },
  { titleKey: "concept.links.relatedTitle", memberType: RELATED },
  { titleKey: "concept.links.equivalentTitle", memberType: CLOSE_MATCH },
];

const linkableConcepts = (
  conceptsWithLinks: ConceptWithLink[],
  currentId?: string,
): ConceptWithLink[] =>
  conceptsWithLinks
    .filter((c) => c.id !== currentId)
    .map(({ id, label, typeOfLink }) => ({ id, label, typeOfLink }));

const splitByLink = (conceptsWithLinks: ConceptWithLink[], memberType: LinkType) => {
  const linked: ConceptWithLink[] = [];
  const available: ConceptWithLink[] = [];
  conceptsWithLinks.forEach((concept) => {
    if (concept.typeOfLink === memberType) linked.push(concept);
    else if (concept.typeOfLink === NONE) available.push(concept);
  });
  return { linked, available };
};

const LinksEdition = ({
  conceptsWithLinks: initialConceptsWithLinks,
  currentId,
  handleChange,
  equivalentLinks,
  handleChangeEquivalentLinks,
}: Readonly<LinksEditionProps>) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [conceptsWithLinks, setConceptsWithLinks] = useState<ConceptWithLink[]>(() =>
    linkableConcepts(initialConceptsWithLinks, currentId),
  );

  const linkTypes: LinkTypeDefinition[] = useMemo(() => {
    const t1 = i18n.getFixedT("fr");
    return LINK_TYPES.map(({ titleKey, memberType }) => ({ title: t1(titleKey), memberType }));
  }, [i18n]);

  const { title, memberType } = linkTypes[activeTab];
  const { linked, available } = splitByLink(conceptsWithLinks, memberType);

  // La PickList ne connaît que l'onglet courant : les concepts liés par un autre
  // type n'y figurent pas et doivent rester tels quels.
  const relink = (nowLinked: ConceptWithLink[]) => {
    const linkedIds = new Set(nowLinked.map(({ id }) => id));
    const updated = conceptsWithLinks.map((concept) => {
      if (linkedIds.has(concept.id)) return { ...concept, typeOfLink: memberType };
      if (concept.typeOfLink === memberType) return { ...concept, typeOfLink: NONE };
      return concept;
    });
    setConceptsWithLinks(updated);
    handleChange(updated);
  };

  const isEquivalentTab = memberType === CLOSE_MATCH;

  return (
    <TabView
      activeIndex={activeTab}
      onTabChange={(e: TabViewTabChangeEvent) => setActiveTab(e.index)}
    >
      {linkTypes.map(({ title: tabTitle }) => (
        <TabPanel key={tabTitle} header={tabTitle}>
          {isEquivalentTab ? (
            <EquivalentLinks
              links={equivalentLinks}
              updateEquivalentLinks={handleChangeEquivalentLinks}
            />
          ) : (
            <PickList
              // Remonte la PickList à chaque onglet : sa sélection interne ne doit
              // pas survivre au changement de type de lien.
              key={memberType}
              dataKey="id"
              source={available}
              target={linked}
              onChange={(event) => {
                // PrimeReact type les deux listes en `any` : on rétablit le type au passage.
                relink(event.target as ConceptWithLink[]);
              }}
              itemTemplate={(concept: ConceptWithLink) => concept.label}
              sourceHeader={t("concept.links.availablePanelTitle", { size: available.length })}
              targetHeader={`${title} (${linked.length})`}
              filter
              filterBy="label"
              sourceFilterPlaceholder={t("common.searchLabelPlaceholder")}
              targetFilterPlaceholder={t("common.searchLabelPlaceholder")}
              showSourceControls={false}
              showTargetControls={false}
              sourceStyle={{ height: "20rem" }}
              targetStyle={{ height: "20rem" }}
            />
          )}
        </TabPanel>
      ))}
    </TabView>
  );
};

export default LinksEdition;
