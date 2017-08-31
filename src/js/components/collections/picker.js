import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { propTypes as overviewPropTypes } from 'js/utils/collections/collection-overview';
import { Link } from 'react-router-dom';
import { dictionary } from 'js/utils/dictionary';
import Panel from 'js/utils/panel';
import Pagination from 'js/components/shared/pagination';
import CollectionItem from './list-item';
import { filterDeburr } from 'js/utils/array-utils';
import addLogo from 'js/components/shared/logo-add';
import delLogo from 'js/components/shared/logo-del';
import './picker.css';

class CollectionsPicker extends Component {
	constructor(props) {
		super(props);

		this.trackCollections = collections => {
			return (
				collections &&
				collections.map(({ id, label }) => ({
					id,
					label,
					isAdded: false,
				}))
			);
		};

		this.state = {
			searchLabel: '',
			goBackToCollections: false,
			collections: this.trackCollections(this.props.collections),
		};

		this.handleChange = searchLabel => {
			this.setState({ searchLabel });
		};

		this.addCollection = id => {
			const collectionsToValidate = this.state.collections.map(collection => {
				//mutation, but not harmful here
				if (collection.id === id) collection.isAdded = true;
				return collection;
			});
			this.setState({
				collectionsToValidate,
			});
		};

		this.removeCollection = id => {
			const collectionsToValidate = this.state.collections.map(collection => {
				//mutation, but not harmful here
				if (collection.id === id) collection.isAdded = false;
				return collection;
			});
			this.setState({
				collectionsToValidate,
			});
		};

		this.handleClickValid = e => {
			const added = this.state.collections.filter(({ isAdded }) => isAdded);
			const addedIds = added.map(({ id }) => id);
			this.props.handleAction(addedIds);
		};

		this.getCollectionsByStatus = () => {
			const { collections } = this.state;
			const check = filterDeburr(this.state.searchLabel);
			return collections.reduce(
				(byStatus, { id, label, isAdded }) => {
					if (isAdded) byStatus.added.push({ id, label });
					else check(label) && byStatus.toAdd.push({ id, label });
					return byStatus;
				},
				{ toAdd: [], added: [] }
			);
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.collections !== this.props.collections)
			this.setState({
				collections: this.trackCollections(nextProps.collections),
			});
	}

	render() {
		const { searchLabel } = this.state;
		const { title, panelTitle, labelWarning, labelValidateButton } = this.props;

		//validation has not been asked yet
		const { toAdd, added } = this.getCollectionsByStatus();

		const toAddEls = toAdd.map(({ id, label }) =>
			<CollectionItem
				key={id}
				id={id}
				label={label}
				logo={addLogo}
				handleClick={this.addCollection}
			/>
		);

		const addedEls = added.map(({ id, label }) =>
			<CollectionItem
				key={id}
				id={id}
				label={label}
				logo={delLogo}
				handleClick={this.removeCollection}
			/>
		);

		//The user has to add at least one collection
		const message =
			added.length === 0 &&
			<div className="col-md-8 centered">
				<div className="alert alert-danger bold" role="alert">
					{labelWarning}
				</div>
			</div>;

		const controls = (
			<div className="row btn-line">
				<div className="col-md-2">
					<button className="btn btn-primary btn-lg col-md-12">
						<Link to="/collection">
							{dictionary.buttons.return}
						</Link>
					</button>
				</div>
				{message}
				<div className="col-md-2 pull-right">
					<button
						className="btn btn-primary btn-lg col-md-12"
						onClick={this.handleClickValid}
						disabled={added.length === 0}
					>
						{labelValidateButton}
					</button>
				</div>
			</div>
		);

		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-10 centered col-md-offset-1">
							<h2 className="page-title">
								{title}
							</h2>
						</div>
					</div>
					{controls}
					<div className="row">
						<div className="col-md-6">
							<Panel title={panelTitle}>
								{addedEls}
							</Panel>
						</div>
						<div className="col-md-6 centered">
							<input
								value={searchLabel}
								onChange={e => this.handleChange(e.target.value)}
								type="text"
								placeholder={dictionary.collections.searchLabel}
								className="form-control"
							/>
							<Pagination itemEls={toAddEls} itemsPerPage="10" />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

CollectionsPicker.propTypes = {
	title: PropTypes.string.isRequired,
	panelTitle: PropTypes.string.isRequired,
	labelLoadable: PropTypes.string.isRequired,
	labelWarning: PropTypes.string.isRequired,
	labelValidateButton: PropTypes.string.isRequired,
	collection: PropTypes.arrayOf(overviewPropTypes),
	//not required since this component can be created before the collections are
	//loaded
	handleAction: PropTypes.func.isRequired,
};

export default CollectionsPicker;
