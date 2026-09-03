import { PickList } from "primereact/picklist";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { CLOSE_MATCH, NONE } from "@sdk/constants";

import { Link } from "../../../../../model/concepts/concept";
import { LINK_TYPES } from "../../../../utils/linkTypes";
import { EquivalentLinks } from "./EquivalentLinks";

type LinkType = string;

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
  /** Type de lien à éditer : c'est le sommaire qui en décide. */
  activeLinkType: LinkType;
}

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
  activeLinkType,
}: Readonly<LinksEditionProps>) => {
  const { t, i18n } = useTranslation();
  const [conceptsWithLinks, setConceptsWithLinks] = useState<ConceptWithLink[]>(() =>
    linkableConcepts(initialConceptsWithLinks, currentId),
  );

  const title = useMemo(() => {
    const t1 = i18n.getFixedT("fr");
    const linkType = LINK_TYPES.find(({ memberType }) => memberType === activeLinkType);
    return linkType ? t1(linkType.titleKey) : "";
  }, [i18n, activeLinkType]);

  const { linked, available } = splitByLink(conceptsWithLinks, activeLinkType);

  // La PickList ne connaît que le type courant : les concepts liés par un autre
  // type n'y figurent pas et doivent rester tels quels.
  const relink = (nowLinked: ConceptWithLink[]) => {
    const linkedIds = new Set(nowLinked.map(({ id }) => id));
    const updated = conceptsWithLinks.map((concept) => {
      if (linkedIds.has(concept.id)) return { ...concept, typeOfLink: activeLinkType };
      if (concept.typeOfLink === activeLinkType) return { ...concept, typeOfLink: NONE };
      return concept;
    });
    setConceptsWithLinks(updated);
    handleChange(updated);
  };

  if (activeLinkType === CLOSE_MATCH) {
    return (
      <EquivalentLinks
        links={equivalentLinks}
        updateEquivalentLinks={handleChangeEquivalentLinks}
      />
    );
  }

  return (
    <PickList
      // Remonte la PickList à chaque type : sa sélection interne ne doit pas
      // survivre au changement de type de lien.
      key={activeLinkType}
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
  );
};

export default LinksEdition;
