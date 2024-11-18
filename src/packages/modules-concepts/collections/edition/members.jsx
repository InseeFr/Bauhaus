import { useState } from 'react';

import MainDictonary from '../../../deprecated-locales';
import { D1 } from '../../../modules-concepts/i18n';
import { Panel } from '@components/panel';
import { AddLogo } from '@components/logo/logo-add';
import { DelLogo } from '@components/logo/logo-del';
import { arrayDifferenceByID, filterDeburr } from '../../../utils/array-utils';
import { PickerItem } from '@components/picker-item';
import { Column, Row } from '@components/layout';
import { TextInput } from '@components/form/input';
import { Pagination } from '@components/pagination';

const extractMembers = (concepts) => {
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
const trackMembers = (memberList) => {
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
	const [concepts, setConcepts] = useState(
		trackConcepts(
			trackPotentialsConcepts(conceptList, members),
			trackMembers(members),
		),
	);

	const addConcept = (id) => {
		const conceptsToAdd = concepts.map((concept) => {
			if (concept.id === id) concept.isAdded = true;
			return concept;
		});
		setConcepts(conceptsToAdd);
		handleChange(extractMembers(concepts));
	};

	const removeConcept = (id) => {
		const conceptsToDel = concepts.map((concept) => {
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
				else if (check(label)) {
					byStatus.toAdd.push({ id, label });
				}
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
		<Row>
			<Column>
				<Panel title={D1.collectionMembersPanelTitle(addedEls.length)}>
					{addedEls}
				</Panel>
			</Column>
			<Column>
				<TextInput
					value={searchLabel}
					onChange={(e) => setSearchLabel(e.target.value)}
					placeholder={MainDictonary.searchLabelPlaceholder}
				/>
				<Pagination itemEls={toAddEls} />
			</Column>
		</Row>
	);
};

export default CollectionMembersEdition;
