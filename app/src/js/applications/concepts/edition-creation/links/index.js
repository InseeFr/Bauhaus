import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import { D1 } from 'js/i18n';
import ConceptToLink from './concept-to-link';
import SearchConceptsByLabel from './search-concepts-by-label';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';
import { AddLogo, DelLogo, PickerItem, filterDeburr } from '@inseefr/wilco';

import {
	BROADER,
	NARROWER,
	REFERENCES,
	SUCCEED,
	RELATED,
	NONE,
	CLOSE_MATCH
} from 'js/constants';
import { EquivalentLinks } from './equivalentLinks';

const linkTypes = [
	{
		title: D1.narrowerTitle,
		memberType: NARROWER,
	},
	{
		title: D1.broaderTitle,
		memberType: BROADER,
	},
	{
		title: D1.referencesTitle,
		memberType: REFERENCES,
	},
	{
		title: D1.replacesTitle,
		memberType: SUCCEED,
	},
	{
		title: D1.relatedTitle,
		memberType: RELATED,
	},
	{
		title: D1.equivalentTitle,
		memberType: CLOSE_MATCH,
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
	}
	updateEquivalentLinks = (links) => {
		this.props.handleChangeEquivalentLinks(links)
	}
	render() {
		const { searchLabel, activeTab } = this.state;
		const { members, hits } = this.getMembersAndHits();
		const { addMember, removeMember } = this;

		const memberEls = members.map(({ id, label }) => (
			<PickerItem
				key={id}
				id={id}
				label={label}
				logo={DelLogo}
				handleClick={removeMember}
			/>
		));
		const hitEls = hits.map(({ id, label }) => (
			<PickerItem
				key={id}
				id={id}
				label={label}
				logo={AddLogo}
				handleClick={addMember}
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
				{
					title !== D1.equivalentTitle ?
						(
							<ConceptToLink
								title={title}
								memberEls={memberEls}
								searchComponent={searchComponent}
							/>
						) :
						<EquivalentLinks links={this.props.equivalentLinks} updateEquivalentLinks={this.updateEquivalentLinks}/>
				}
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
	conceptsWithLinks: conceptsWithLinksPropTypes.isRequired,
	handleChange: PropTypes.func.isRequired,
	handleChangeEquivalentLinks: PropTypes.func.isRequired,
};

export default LinksEdition;
