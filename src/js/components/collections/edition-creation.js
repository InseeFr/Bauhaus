import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PageTitle from 'js/components/shared/page-title';
import CollectionEditionCreationControls from './edition-creation-controls';
import GeneralEdition from './general-edition';
import MembersEdition from './members-edition';
import { propTypes as generalPropTypes } from 'js/utils/collections/general';

class CollectionEditionCreation extends Component {
	constructor(props) {
		super(props);
		const { general, members } = props;

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
		this.handleChangeGeneral = update => {
			const data = this.state.data;
			const general = data.general;
			const newData = Object.assign(data, {
				general: Object.assign(general, update),
			});
			this.setState({
				data: newData,
			});
		};

		//`newLinks` looks like
		//`[{ id: '...',  label: '...', typeOfLink: '...' }, { ... }, { ... }]
		//This new array has the same length as the initial `conceptsWithLinks`
		//array, `typeOfLink` is the only property updated. It can switch from:
		// - something (PARENT, CHILD...) to NONE if it has been removed
		// - NONE to something (PARENT, CHILD...) if it has been added.
		//It should not be switched directle from something to something else since
		//the UI does not expose this scenario (we can only remove or add).
		this.handleChangeMembers = newMembers =>
			this.setState({
				data: {
					...this.state.data,
					members: newMembers,
				},
			});

		this.handleSave = () => {
			this.saveCollection();
		};

		this.redirectCancel = () => {
			if (this.props.creation) {
				return `/collections`;
			} else {
				return `/collection/${general.id}`;
			}
		};

		this.saveCollection = () => {
			this.props.save(this.state.data);
		};
	}

	render() {
		const {
			stampList,
			title,
			subtitle,
			collectionList,
			conceptList,
			creation,
			langs,
		} = this.props;
		const { data: { general, members } } = this.state;
		const {
			id: initialId,
			prefLabelLg1: initialPrefLabelLg1,
		} = this.props.general;

		return (
			<div>
				<div className="container">
					<PageTitle title={title} subtitle={subtitle} />;
					{creation && (
						<CollectionEditionCreationControls
							general={general}
							collectionList={collectionList}
							creation
							handleSave={this.handleSave}
							redirectCancel={this.redirectCancel}
						/>
					)}
					{!creation && (
						<CollectionEditionCreationControls
							general={general}
							collectionList={collectionList}
							initialId={initialId}
							initialPrefLabelLg1={initialPrefLabelLg1}
							handleSave={this.handleSave}
							redirectCancel={this.redirectCancel}
						/>
					)}
					<GeneralEdition
						general={general}
						creation={creation}
						handleChange={this.handleChangeGeneral}
						stampList={stampList}
						langs={langs}
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

CollectionEditionCreation.propTypes = {
	creation: PropTypes.bool,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string,
	general: generalPropTypes.isRequired,
	members: PropTypes.array.isRequired,
	collectionList: PropTypes.array.isRequired,
	conceptList: PropTypes.array.isRequired,
	stampList: PropTypes.array.isRequired,
	save: PropTypes.func.isRequired,
	langs: PropTypes.object.isRequired,
};

export default CollectionEditionCreation;
