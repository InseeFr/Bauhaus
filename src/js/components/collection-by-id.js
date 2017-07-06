import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import MenuConcepts from './menu-concepts';
import Loadable from 'react-loading-overlay';
import CollectionGeneral from './collection-general';
import { dictionary } from 'js/utils/dictionary';
import { Note } from 'js/utils/note';
import { sortArray } from 'js/utils/array-utils';
import {
	loadCollectionGeneral,
	loadCollectionMembers,
} from '../actions/collection';
import { postCollectionsToValidate } from 'js/utils/remote-api';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');
const sortByLabelFr = sortArray('prefLabelFr');
const sortByLabelEn = sortArray('prefLabelEn');

class CollectionByID extends Component {
	constructor(props) {
		super(props);

		this.state = {
			english: false,
			collectionsToValid: [{ id: extractId(props) }],
			validation: 'WAITING',
		};

		this.toggleEnglish = () =>
			this.setState({
				english: !this.state.english,
			});

		this.handleClickSend = e => {
			e.preventDefault();
			this.props.history.push('/collection/' + extractId(this.props) + '/send');
		};

		this.handleClickModif = e => {
			e.preventDefault();
			this.props.history.push(
				'/collection/' + extractId(this.props) + '/modify'
			);
		};

		this.handleClickValid = e => {
			e.preventDefault();
			const data = {
				collectionsToValid: this.state.collectionsToValid,
			};
			this.setState({
				validation: 'PENDING',
			});
			postCollectionsToValidate(data)
				.then(() => {
					this.props.loadCollectionGeneral(extractId(this.props));
				})
				.then(() => {
					this.setState({
						validation: 'DONE',
					});
					this.props.history.push('/collection/' + extractId(this.props));
				});
		};
	}

	componentWillMount() {
		this.props.loadCollectionGeneral(extractId(this.props));
		this.props.loadCollectionMembers(extractId(this.props));
	}

	render() {
		const { collectionGeneral, collectionMembers } = this.props;
		const { english, validation } = this.state;

		if (!collectionGeneral || !collectionMembers) return null;

		const memberListFr = sortByLabelFr(collectionMembers).map(item =>
			<li key={item.id}>
				<Link to={'/concept/' + item.id}>
					{item.prefLabelFr}
				</Link>
			</li>
		);
		const memberListEn = sortByLabelEn(collectionMembers).map(item =>
			<li key={item.id}>
				<Link to={'/concept/' + item.id}>
					{item.prefLabelEn}
				</Link>
			</li>
		);

		if (validation === 'PENDING') {
			return (
				<div>
					<MenuConcepts />
					<Loadable
						active={true}
						spinner
						text={dictionary.loadable.validation}
						color="#457DBB"
						background="grey"
						spinnerSize="400px"
					/>
				</div>
			);
		}

		return (
			<div>
				<MenuConcepts />
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<label className="pull-right">
								<input
									type="checkbox"
									checked={english}
									onChange={this.toggleEnglish}
								/>{' '}
								{dictionary.displayLg2}
							</label>
						</div>
					</div>
					{collectionGeneral.isValidated ===
						dictionary.status.collection.valid &&
						<div className="row">
							<div className="col-md-8">
								<h2>
									{collectionGeneral.prefLabelFr}
								</h2>
							</div>
							<div className="col-md-2">
								<button
									className="btn btn-primary btn-lg col-md-12"
									onClick={this.handleClickSend}
								>
									{dictionary.buttons.send}
								</button>
							</div>
							<div className="col-md-2">
								<button
									className="btn btn-primary btn-lg col-md-12"
									onClick={this.handleClickModif}
								>
									{dictionary.buttons.modify}
								</button>
							</div>
						</div>}
					{collectionGeneral.isValidated ===
						dictionary.status.collection.provisional &&
						<div className="row">
							<div className="col-md-6">
								<h2>
									{collectionGeneral.prefLabelFr}
								</h2>
							</div>
							<div className="col-md-2">
								<button
									className="btn btn-primary btn-lg col-md-12"
									onClick={this.handleClickSend}
								>
									{dictionary.buttons.send}
								</button>
							</div>
							<div className="col-md-2">
								<button
									className="btn btn-primary btn-lg col-md-12"
									onClick={this.handleClickModif}
								>
									{dictionary.buttons.modify}
								</button>
							</div>
							<div className="col-md-2">
								<button
									className="btn btn-primary btn-lg col-md-12"
									onClick={this.handleClickValid}
								>
									{dictionary.buttons.validate}
								</button>
							</div>
						</div>}
					<h2>
						{english &&
							<em>
								{collectionGeneral.prefLabelEn}{' '}
							</em>}
					</h2>
					<CollectionGeneral attr={collectionGeneral} />
					{collectionGeneral.descriptionFr &&
						<div className="row">
							<Note
								text={collectionGeneral.descriptionFr}
								title={dictionary.collection.description}
								lang="fr"
								alone={!english}
							/>
							{english &&
								<Note
									text={collectionGeneral.descriptionEn}
									title={dictionary.collection.description}
									lang="en"
									alone={false}
								/>}
						</div>}
					<div className="row">
						<Note
							text={memberListFr}
							title={dictionary.collection.members}
							lang="fr"
							alone={!english}
						/>
						{english &&
							<Note
								text={memberListEn}
								title={dictionary.collection.members}
								lang="en"
								alone={false}
							/>}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = extractId(ownProps);
	return {
		collectionGeneral: state.collectionGeneral[id],
		collectionMembers: state.collectionMembers[id],
	};
};

const mapDispatchToProps = {
	loadCollectionGeneral,
	loadCollectionMembers,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	withRouter(CollectionByID)
);
