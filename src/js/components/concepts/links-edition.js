import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import D from 'js/i18n';
import ConceptToLink from './concept-to-link';
import SearchConceptsByLabel from './search-concepts-by-label';
import { filterDeburr } from 'js/utils/array-utils';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';
import logoAdd from 'js/components/shared/logo-add';
import logoDel from 'js/components/shared/logo-del';
import ConceptItem from './list-item';

import {
	BROADER,
	NARROWER,
	REFERENCES,
	SUCCEED,
	RELATED,
	NONE,
} from 'js/constants';
const linkTypes = [
	{
		title: D.narrowerTitle,
		memberType: NARROWER,
	},
	{
		title: D.broaderTitle,
		memberType: BROADER,
	},
	{
		title: D.referencesTitle,
		memberType: REFERENCES,
	},
	{
		title: D.replacesTitle,
		memberType: SUCCEED,
	},
	{
		title: D.relatedTitle,
		memberType: RELATED,
	},
];

class LinksEdition extends Component {
	constructor(props) {
		super(props);
		const { conceptsWithLinks, currentId } = props;
		this.state = {
			searchLabel: '',
			activeTab: 0,
			conceptsWithLinks: conceptsWithLinks
				.filter(c => c.id !== currentId)
				.map(({ id, label, typeOfLink }) => ({
					id,
					label,
					typeOfLink,
				})),
		};

		this.handleSearch = label => {
			this.setState({
				searchLabel: label,
			});
		};

		this.handleSelectTab = activeTab =>
			this.setState({
				activeTab,
			});

		this.addMember = id => {
			//avoid mutating the array
			const conceptsWithLinks = this.state.conceptsWithLinks.map(concept => {
				if (concept.id === id)
					return {
						...concept,
						typeOfLink: this.getActualType(),
					};
				return concept;
			});
			this.updateConceptsWithLinks(conceptsWithLinks);
		};

		this.removeMember = id => {
			//avoid mutating the initial array
			const conceptsWithLinks = this.state.conceptsWithLinks.map(concept => {
				if (concept.id === id)
					return {
						...concept,
						typeOfLink: NONE,
					};
				return concept;
			});
			this.updateConceptsWithLinks(conceptsWithLinks);
		};

		this.updateConceptsWithLinks = conceptsWithLinks => {
			//TODO we do not need to update the current state, we should handle
			//this with `commponentWillReceiveProps`
			this.setState({ conceptsWithLinks });
			this.props.handleChange(conceptsWithLinks);
		};

		this.getMembersAndHits = () => {
			const members = [];
			const hits = [];
			const actualType = this.getActualType();
			const check = filterDeburr(this.state.searchLabel);
			this.state.conceptsWithLinks.forEach(concept => {
				const { typeOfLink, label } = concept;
				if (typeOfLink === actualType) members.push(concept);
				else if (typeOfLink === NONE && check(label)) hits.push(concept);
			});
			return {
				members,
				hits,
			};
		};
		this.getActualType = () => linkTypes[this.state.activeTab].memberType;
		this.isPanelParent = () => this.getActualType() === NARROWER;
		//if the concept already has a parent, we cannot add a parent
		//TODO check if the previous assertion is right
		this.isAddDisabled = members => this.isPanelParent() && members.length > 0;
	}

	render() {
		const { searchLabel, activeTab } = this.state;
		const { members, hits } = this.getMembersAndHits();
		const { addMember, removeMember } = this;

		const memberEls = members.map(({ id, label }) => (
			<ConceptItem
				key={id}
				id={id}
				label={label}
				logo={logoDel}
				handleClick={removeMember}
			/>
		));
		//if a concept already has a parent, no other parent can be added.
		//TODO check if the previous assertion is right
		const handleClickAdd = !this.isAddDisabled(members) ? addMember : undefined;
		const hitEls = hits.map(({ id, label }) => (
			<ConceptItem
				key={id}
				id={id}
				label={label}
				logo={logoAdd}
				handleClick={handleClickAdd}
			/>
		));

		const searchComponent = (
			<SearchConceptsByLabel
				searchLabel={searchLabel}
				handleSearch={this.handleSearch}
				hitEls={hitEls}
			/>
		);

		const tabs = linkTypes.map(({ title, memberType }, i) => (
			<Tab key={title} eventKey={i} title={title} style={{ marginTop: '20px' }}>
				<ConceptToLink
					title={title}
					memberEls={memberEls}
					searchComponent={searchComponent}
				/>
			</Tab>
		));

		return (
			<ul className="nav nav-tabs nav-justified">
				<Tabs
					id="kindOfLink"
					activeKey={activeTab}
					onSelect={this.handleSelectTab}
					justified
				>
					{tabs}
				</Tabs>
			</ul>
		);
	}
}

LinksEdition.propTypes = {
	//all concepts not referenced by the actual concept, and hence which can
	//be added as a parent, a child, a reference, a successor or a related
	//concept.
	//concepts are supposed to be sorted by `label`
	conceptsWithLinks: conceptsWithLinksPropTypes.isRequired,
	handleChange: PropTypes.func.isRequired,
};

export default LinksEdition;
