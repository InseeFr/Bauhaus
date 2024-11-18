import { Component } from 'react';
import { D1 } from '../../../deprecated-locales';
import ConceptToLink from './concept-to-link';
import SearchConceptsByLabel from './search-concepts-by-label';

import {
	BROADER,
	CLOSE_MATCH,
	NARROWER,
	NONE,
	REFERENCES,
	RELATED,
	SUCCEED,
} from '../../../sdk/constants';
import { EquivalentLinks } from './equivalentLinks';
import { AddLogo } from '@components/logo/logo-add';
import { DelLogo } from '@components/logo/logo-del';
import { filterDeburr } from '../../../utils/array-utils';
import { PickerItem } from '../../../components/picker-item';
import { TabPanel, TabView } from 'primereact/tabview';

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
				.filter((c) => c.id !== currentId)
				.map(({ id, label, typeOfLink }) => ({
					id,
					label,
					typeOfLink,
				})),
		};

		this.handleSearch = (label) => {
			this.setState({
				searchLabel: label,
			});
		};

		this.handleSelectTab = (activeTab) =>
			this.setState({
				activeTab,
			});

		this.addMember = (id) => {
			this.updateConceptsWithLinks(
				this.state.conceptsWithLinks.map((concept) => {
					if (concept.id === id)
						return {
							...concept,
							typeOfLink: this.getActualType(),
						};
					return concept;
				}),
			);
		};

		this.removeMember = (id) => {
			this.updateConceptsWithLinks(
				this.state.conceptsWithLinks.map((concept) => {
					if (concept.id === id)
						return {
							...concept,
							typeOfLink: NONE,
						};
					return concept;
				}),
			);
		};

		this.updateConceptsWithLinks = (conceptsWithLinks) => {
			this.setState({ conceptsWithLinks });
			this.props.handleChange(conceptsWithLinks);
		};

		this.getMembersAndHits = () => {
			const members = [];
			const hits = [];
			const actualType = this.getActualType();
			const check = filterDeburr(this.state.searchLabel);
			this.state.conceptsWithLinks.forEach((concept) => {
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
		this.props.handleChangeEquivalentLinks(links);
	};

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

		const tabs = linkTypes.map(({ title }) => (
			<TabPanel key={title} header={title}>
				{title !== D1.equivalentTitle ? (
					<ConceptToLink
						title={title}
						memberEls={memberEls}
						searchComponent={searchComponent}
					/>
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
				onTabChange={({ index }) => this.setState({ activeTab: index })}
			>
				{tabs}
			</TabView>
		);
	}
}

export default LinksEdition;
