import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AddLogo, arrayDifferenceByID, DelLogo, filterDeburr, Pagination, Panel, PickerItem } from '@inseefr/wilco';

import D, { D1 } from 'js/i18n';


const extractMembers = concepts => {
	return concepts.reduce((members, { id, label, isAdded }) => {
		if (isAdded) members.push({ id, label });
		return members;
	}, []);
};

const trackPotentialsConcepts = (conceptList, memberList) => {
	const potentialList = arrayDifferenceByID(conceptList, memberList);
	return (
		potentialList &&
		potentialList.map(({ id, label }) => ({
			id,
			label,
			isAdded: false,
		}))
	);
};
const trackMembers = memberList => {
	return (
		memberList &&
		memberList.map(({ id, label }) => ({
			id,
			label,
			isAdded: true,
		}))
	);
};
const trackConcepts = (potentialList, memberList) => {
	return potentialList.concat(memberList);
};

const CollectionMembersEdition = ({ conceptList, members, handleChange }) => {
	const [searchLabel, setSearchLabel] = useState('');
	const [concepts, setConcepts] = useState(trackConcepts(trackPotentialsConcepts(conceptList, members),
		trackMembers(members)));

	const addConcept = id => {
		const conceptsToAdd = concepts.map(concept => {
			if (concept.id === id) concept.isAdded = true;
			return concept;
		});
		setConcepts(conceptsToAdd);
		handleChange(extractMembers(concepts));
	};

	const removeConcept = id => {
		const conceptsToDel = concepts.map(concept => {
			if (concept.id === id) concept.isAdded = false;
			return concept;
		});
		setConcepts(conceptsToDel);
		handleChange(extractMembers(concepts));
	};

	const getConceptsByStatus = () => {
		const check = filterDeburr(searchLabel);
		return concepts.reduce(
			(byStatus, { id, label, isAdded }) => {
				if (isAdded) byStatus.added.push({ id, label });
				else check(label) && byStatus.toAdd.push({ id, label });
				return byStatus;
			},
			{ toAdd: [], added: [] },
		);
	};

	const { toAdd, added } = getConceptsByStatus();

	const toAddEls = toAdd.map(({ id, label }) => (
		<PickerItem
			key={id}
			id={id}
			label={label}
			logo={AddLogo}
			handleClick={addConcept}
		/>
	));

	const addedEls = added.map(({ id, label }) => (
		<PickerItem
			key={id}
			id={id}
			label={label}
			logo={DelLogo}
			handleClick={removeConcept}
		/>
	));

	return (
		<div className='row'>
			<div className='col-md-6'>
				<Panel title={D1.collectionMembersPanelTitle}>{addedEls}</Panel>
			</div>
			<div className='col-md-6 text-center'>
				<input
					value={searchLabel}
					onChange={e => setSearchLabel(e.target.value)}
					type='text'
					placeholder={D.searchLabelPlaceholder}
					className='form-control'
				/>
				<Pagination itemEls={toAddEls} itemsPerPage='10' />
			</div>
		</div>
	);
};

CollectionMembersEdition.propTypes = {
	members: PropTypes.array.isRequired,
	conceptList: PropTypes.array.isRequired,
	handleChange: PropTypes.func.isRequired,
};

export default CollectionMembersEdition;
