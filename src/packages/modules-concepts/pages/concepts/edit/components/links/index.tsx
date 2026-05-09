import { TabPanel, TabView, TabViewTabChangeEvent } from "primereact/tabview";
import { Component, ReactElement } from "react";

import { AddLogo } from "@components/logo/logo-add";
import { DelLogo } from "@components/logo/logo-del";
import { PickerItem } from "@components/picker-item";

import { BROADER, CLOSE_MATCH, NARROWER, NONE, REFERENCES, RELATED, SUCCEED } from "@sdk/constants";

import { filterDeburr } from "@utils/array-utils";

import { D1 } from "../../../../../../deprecated-locales";
import { Link } from "../../../../../../model/concepts/concept";
import ConceptToLink from "./concept-to-link";
import { EquivalentLinks } from "./equivalentLinks";
import SearchConceptsByLabel from "./search-concepts-by-label";

type LinkType = string;

interface LinkTypeDefinition {
  title: string;
  memberType: LinkType;
}

const linkTypes: LinkTypeDefinition[] = [
  { title: D1.narrowerTitle, memberType: NARROWER },
  { title: D1.broaderTitle, memberType: BROADER },
  { title: D1.referencesTitle, memberType: REFERENCES },
  { title: D1.replacesTitle, memberType: SUCCEED },
  { title: D1.relatedTitle, memberType: RELATED },
  { title: D1.equivalentTitle, memberType: CLOSE_MATCH },
];

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

interface LinksEditionState {
  searchLabel: string;
  activeTab: number;
  conceptsWithLinks: ConceptWithLink[];
}

class LinksEdition extends Component<LinksEditionProps, LinksEditionState> {
  constructor(props: LinksEditionProps) {
    super(props);
    const { conceptsWithLinks, currentId } = props;
    this.state = {
      searchLabel: "",
      activeTab: 0,
      conceptsWithLinks: conceptsWithLinks
        .filter((c) => c.id !== currentId)
        .map(({ id, label, typeOfLink }) => ({ id, label, typeOfLink })),
    };
  }

  handleSearch = (label: string) => {
    this.setState({ searchLabel: label });
  };

  handleSelectTab = (activeTab: number) => {
    this.setState({ activeTab });
  };

  addMember = (id: string) => {
    this.updateConceptsWithLinks(
      this.state.conceptsWithLinks.map((concept) =>
        concept.id === id ? { ...concept, typeOfLink: this.getActualType() } : concept,
      ),
    );
  };

  removeMember = (id: string) => {
    this.updateConceptsWithLinks(
      this.state.conceptsWithLinks.map((concept) =>
        concept.id === id ? { ...concept, typeOfLink: NONE } : concept,
      ),
    );
  };

  updateConceptsWithLinks = (conceptsWithLinks: ConceptWithLink[]) => {
    this.setState({ conceptsWithLinks });
    this.props.handleChange(conceptsWithLinks);
  };

  getMembersAndHits = () => {
    const members: ConceptWithLink[] = [];
    const hits: ConceptWithLink[] = [];
    const actualType = this.getActualType();
    const check = filterDeburr(this.state.searchLabel);
    this.state.conceptsWithLinks.forEach((concept) => {
      const { typeOfLink, label } = concept;
      if (typeOfLink === actualType) members.push(concept);
      else if (typeOfLink === NONE && check(label)) hits.push(concept);
    });
    return { members, hits };
  };

  getActualType = (): LinkType => linkTypes[this.state.activeTab].memberType;

  updateEquivalentLinks = (links: (Link | { urn: string })[]) => {
    this.props.handleChangeEquivalentLinks(links);
  };

  render() {
    const { searchLabel, activeTab } = this.state;
    const { members, hits } = this.getMembersAndHits();
    const { addMember, removeMember } = this;

    const memberEls: ReactElement[] = members.map(({ id, label }) => (
      <PickerItem key={id} id={id} label={label} logo={<DelLogo />} handleClick={removeMember} />
    ));
    const hitEls: ReactElement[] = hits.map(({ id, label }) => (
      <PickerItem key={id} id={id} label={label} logo={<AddLogo />} handleClick={addMember} />
    ));

    const searchComponent = (
      <SearchConceptsByLabel
        searchLabel={searchLabel}
        handleSearch={this.handleSearch}
        hitEls={hitEls}
      />
    );

    const tabs = linkTypes.map(({ title }) => (
      <TabPanel key={title} header={title}>
        {title !== D1.equivalentTitle ? (
          <ConceptToLink title={title} memberEls={memberEls} searchComponent={searchComponent} />
        ) : (
          <EquivalentLinks
            links={this.props.equivalentLinks}
            updateEquivalentLinks={this.updateEquivalentLinks}
          />
        )}
      </TabPanel>
    ));

    return (
      <TabView
        activeIndex={activeTab}
        onTabChange={(e: TabViewTabChangeEvent) => this.setState({ activeTab: e.index })}
      >
        {tabs}
      </TabView>
    );
  }
}

export default LinksEdition;
