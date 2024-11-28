import { Component } from 'react';

import { PageTitle } from '@components/page-title';

import MembersEdition from '../../collections/edition/members';
import CollectionEditionCreationControls from './controls';
import GeneralEdition from './general';
import { validate } from './validation';

class CollectionEditionCreation extends Component {
	constructor(props) {
		super(props);
		const { general, members, setSubmitting } = props;

		this.state = {
			id: general.id,
			data: {
				general: { ...general },
				members: members.map(({ id, prefLabelLg1 }) => ({
					id,
					label: prefLabelLg1,
				})),
			},
		};

		//update should look like `{ prefLabelLg2: 'something new' }` (we can
		//set mutliple properties at the same time)
		this.handleChangeGeneral = (update) => {
			setSubmitting(true);
			this.setState((state) => ({
				data: {
					...state.data,
					general: {
						...state.data.general,
						...update,
					},
				},
			}));
		};

		//`newLinks` looks like
		//`[{ id: '...',  label: '...', typeOfLink: '...' }, { ... }, { ... }]
		//This new array has the same length as the initial `conceptsWithLinks`
		//array, `typeOfLink` is the only property updated. It can switch from:
		// - something (PARENT, CHILD...) to NONE if it has been removed
		// - NONE to something (PARENT, CHILD...) if it has been added.
		//It should not be switched directle from something to something else since
		//the UI does not expose this scenario (we can only remove or add).
		this.handleChangeMembers = (newMembers) => {
			setSubmitting(true);
			this.setState((state) => ({
				data: {
					...state.data,
					members: newMembers,
				},
			}));
		};

		this.handleSave = () => {
			this.saveCollection();
		};

		this.redirectCancel = () => {
			if (this.props.creation) {
				return `/concepts/collections`;
			} else {
				return `/concepts/collections/${general.id}`;
			}
		};

		this.saveCollection = () => {
			this.props.save(this.state.data);
		};
	}

	render() {
		const {
			title,
			subtitle,
			collectionList,
			conceptList,
			creation,
			submitting,
		} = this.props;

		const {
			data: { general, members },
		} = this.state;

		const { id: initialId, prefLabelLg1: initialPrefLabelLg1 } =
			this.props.general;

		const errors = validate(
			general,
			collectionList,
			initialId,
			initialPrefLabelLg1,
		);

		return (
			<div>
				<div className="container">
					<PageTitle title={title} subtitle={subtitle} />
					<CollectionEditionCreationControls
						handleSave={this.handleSave}
						redirectCancel={this.redirectCancel}
						errors={errors}
						submitting={submitting}
					/>
					<GeneralEdition
						general={general}
						creation={creation}
						handleChange={this.handleChangeGeneral}
						errors={errors}
					/>
					<MembersEdition
						members={members}
						conceptList={conceptList}
						handleChange={this.handleChangeMembers}
					/>
				</div>
			</div>
		);
	}
}

export default CollectionEditionCreation;
