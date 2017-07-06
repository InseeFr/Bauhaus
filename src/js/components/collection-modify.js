import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Loadable from 'react-loading-overlay';
import MenuConcepts from './menu-concepts';
import SelectRmes from '../utils/select-rmes';
import CollectionModifyControl from './collection-modify-control';
import { dictionary } from '../utils/dictionary';
import Panel from '../utils/panel';
import Pagination from './utils/pagination';
import { loadConceptsList } from '../actions/concepts-list';
import { loadStampsList } from '../actions/stamps';
import { postModifiedCollections } from '../utils/remote-api';
import {
	sortArray,
	filterByPrefLabelFr,
	arrayKeepUniqueField,
	arrayDropUniqueField,
	arrayDifferenceByID,
} from '../utils/array-utils';
import fr from '../../img/fr.png';
import en from '../../img/en.png';
import add from '../../img/add.png';
import del from '../../img/del.png';
import buildExtract from 'js/utils/build-extract';

const extractId = buildExtract('id');

const sortByLabel = sortArray('prefLabelFr');

class CollectionModify extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchLabel: '',
			isLabelExisting: false,
			idCollection: '',
			created: '',
			prefLabelFr: '',
			prefLabelEn: '',
			creator: '',
			contributor: '',
			descriptionFr: '',
			descriptionEn: '',
			members: [],
			creation: 'EDITION',
		};

		this.handleChange = searchLabel => {
			this.setState({ searchLabel });
		};

		this.handleChange1 = prefLabelFr => {
			this.setState({ prefLabelFr });
			if (
				arrayKeepUniqueField(this.props.collectionsList, 'prefLabelFr').indexOf(
					_.deburr(prefLabelFr.toLowerCase())
				) !== -1 &&
				prefLabelFr !== this.props.collectionGeneral.prefLabelFr
			)
				this.setState({
					isLabelExisting: true,
				});
			else
				this.setState({
					isLabelExisting: false,
				});
		};
		this.handleChange2 = prefLabelEn => {
			this.setState({ prefLabelEn });
		};
		this.changeSelectCreator = e => {
			this.setState({
				creator: e ? e.value : '',
			});
		};
		this.handleChange3 = descriptionFr => {
			this.setState({ descriptionFr });
		};
		this.handleChange4 = descriptionEn => {
			this.setState({ descriptionEn });
		};

		this.OnClickAddMember = e => {
			this.setState({
				members: [...this.state.members, e],
			});
		};
		this.OnClickDelMember = e => {
			this.setState({
				members: _.pull(this.state.members, e),
			});
		};
		this.return = () => {
			this.props.history.push('/collection/' + this.state.idCollection);
		};
		this.editCollectionData = () => {
			const data = {
				idCollection: this.state.idCollection,
				created: this.state.created,
				prefLabelFr: this.state.prefLabelFr,
				prefLabelEn: this.state.prefLabelEn,
				creator: this.state.creator,
				contributor: this.state.contributor,
				descriptionFr: this.state.descriptionFr,
				descriptionEn: this.state.descriptionEn,
				members: this.state.members,
			};
			if (this.state.prefLabelFr && !this.state.isLabelExisting) {
				this.setState({
					creation: 'PENDING',
				});
				postModifiedCollections(data.idCollection, data).then(() => {
					this.props.history.push('/collection/' + this.state.idCollection);
				});
			}
		};
	}

	componentWillMount() {
		this.props.loadConceptsList();
		this.props.loadStampsList();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			idCollection: nextProps.collectionGeneral.id,
			created: nextProps.collectionGeneral.created,
			prefLabelFr: nextProps.collectionGeneral.prefLabelFr,
			prefLabelEn: nextProps.collectionGeneral.prefLabelEn,
			creator: nextProps.collectionGeneral.creator,
			contributor: nextProps.collectionGeneral.contributor,
			descriptionFr: nextProps.collectionGeneral.descriptionFr,
			descriptionEn: nextProps.collectionGeneral.descriptionEn,
			members: arrayDropUniqueField(nextProps.collectionMembers, 'prefLabelEn'),
		});
	}

	render() {
		const { collectionGeneral, conceptsList, stampsList } = this.props;
		const {
			creator,
			searchLabel,
			members,
			creation,
			prefLabelFr,
			isLabelExisting,
		} = this.state;

		const flagFr = <img src={fr} alt="fr" className="img-flag" />;
		const flagEn = <img src={en} alt="fr" className="img-flag" />;
		const logoAdd = <img src={add} alt="add" className="img-flag" />;
		const logoDel = <img src={del} alt="delete" className="img-flag" />;

		if (!conceptsList) return null;

		const potentialMembers = arrayDifferenceByID(conceptsList, members);

		const potentialMembersList = sortByLabel(
			potentialMembers.filter(filterByPrefLabelFr(_.deburr(searchLabel)))
		).map(item =>
			<li
				key={item.id}
				className="list-group-item"
				onClick={e => this.OnClickAddMember(item)}
			>
				{logoAdd} {item.prefLabelFr}
			</li>
		);

		const membersList = sortByLabel(members).map(item =>
			<li
				key={item.id}
				className="list-group-item"
				onClick={e => this.OnClickDelMember(item)}
			>
				{logoDel} {item.prefLabelFr}
			</li>
		);

		console.log(creator);

		if (creation === 'PENDING' && prefLabelFr && !isLabelExisting) {
			return (
				<div>
					<MenuConcepts />
					<Loadable
						active={true}
						spinner
						text={dictionary.loadable.save}
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
						<div className="col-md-10 centered col-md-offset-1">
							<h2 className="page-title">
								{dictionary.collection.modify}
								<br />&quot; {collectionGeneral.prefLabelFr} &quot;
							</h2>
						</div>
					</div>
					{this.state.idCollection &&
						<CollectionModifyControl
							attr={this.state}
							onChangeSave={this.editCollectionData}
							onChangeReturn={this.return}
						/>}
					<div className="centered">
						<h4>
							( <span className="boldRed">*</span> : {dictionary.requiredFields})
						</h4>
					</div>
					<div className="form-group">
						<label>
							{dictionary.collection.id} <span className="boldRed">*</span>
						</label>
						<input
							type="text"
							defaultValue={collectionGeneral.id}
							className="form-control"
							onChange={e => this.handleChangeId(e.target.value)}
							disabled
						/>
					</div>
					<div className="form-group">
						<label>
							{dictionary.collection.label} ( {flagFr} ){' '}
							<span className="boldRed">*</span>
						</label>
						<input
							type="text"
							className="form-control"
							defaultValue={collectionGeneral.prefLabelFr}
							onChange={e => this.handleChange1(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<label>
							{dictionary.collection.label} ( {flagEn} )
						</label>
						<input
							type="text"
							className="form-control"
							defaultValue={collectionGeneral.prefLabelEn}
							onChange={e => this.handleChange2(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<label>
							{dictionary.collection.creator} <span className="boldRed">*</span>
						</label>
						{stampsList.length > 0 &&
							<SelectRmes
								className="form-control"
								placeholder={dictionary.collection.stamps.defaultValue}
								value={creator}
								options={stampsList}
								onChange={e => this.changeSelectCreator(e)}
								searchable={true}
							/>}
					</div>
					<div className="form-group">
						<label>
							{dictionary.collection.contributor}
						</label>
						<input
							type="text"
							className="form-control"
							defaultValue={collectionGeneral.contributor}
							disabled
						/>
					</div>
					<div className="form-group">
						<label>
							{dictionary.collection.description} ( {flagFr} )
						</label>
						<textarea
							type="text"
							className="form-control"
							defaultValue={collectionGeneral.descriptionFr}
							onChange={e => this.handleChange3(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<label>
							{dictionary.collection.description} ( {flagEn} )
						</label>
						<textarea
							type="text"
							className="form-control"
							defaultValue={collectionGeneral.descriptionEn}
							onChange={e => this.handleChange4(e.target.value)}
						/>
					</div>
					<div className="row">
						<div className="col-md-6">
							<Panel title={dictionary.collection.members}>
								{membersList}
							</Panel>
						</div>
						<div className="col-md-6 centered">
							<input
								value={searchLabel}
								onChange={e => this.handleChange(e.target.value)}
								type="text"
								placeholder={dictionary.collection.searchLabel}
								className="form-control"
							/>
							<Pagination items={potentialMembersList} itemsPerPage="10" />
						</div>
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
		conceptsList: state.conceptsList,
		collectionsList: state.collectionsList,
		stampsList: state.stampsList,
	};
};

const mapDispatchToProps = {
	loadConceptsList,
	loadStampsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	withRouter(CollectionModify)
);
