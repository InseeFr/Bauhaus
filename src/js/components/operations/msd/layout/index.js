import React, { Component } from 'react';
import Outline from 'js/components/operations/msd/outline/';
import D from 'js/i18n';
import PropTypes from 'prop-types';

import './style.scss';

const STATUS = {
	BOTH: 'BOTH',
	SUMMARY: 'SUMMARY',
	CONTENT: 'CONTENT',
};
class MSDComponent extends Component {
	static propTypes = {
		metadataStructure: PropTypes.object.isRequired,
		storeCollapseState: PropTypes.bool,
		children: PropTypes.array,
		baseUrl: PropTypes.string,
		disableSectionAnchor: PropTypes.bool,
	};

	constructor(props) {
		super(props);
		this.state = {
			status: localStorage.getItem('HELP_VIEW') || STATUS.BOTH,
		};
	}

	changeStatus(status) {
		localStorage.setItem('HELP_VIEW', status);
		this.setState(previousState => ({
			status,
		}));
	}
	render() {
		const { status } = this.state;

		const styleSummary = {
			width: status === STATUS.BOTH ? '33%' : '100%',
			display: status === STATUS.CONTENT ? 'none' : 'block',
		};
		const styleContent = {
			width: status === STATUS.BOTH ? '66%' : '100%',
			display: status === STATUS.SUMMARY ? 'none' : 'block',
		};
		const {
			storeCollapseState,
			metadataStructure,
			children,
			baseUrl,
			disableSectionAnchor,
		} = this.props;
		return (
			<div
				id="consulter-sommaire"
				className="container panneau produit-sommaire"
			>
				<section className="sommaire-gauche" style={styleSummary}>
					<div className="titre-sommaire titre">{D.helpSummary}</div>
					<input
						className="form-control"
						disabled
						placeholder={D.search}
						aria-label={D.search}
					/>
					<nav className="sommaire-container">
						<ul className="sommaire">
							{Object.values(metadataStructure).map(metadata => (
								<Outline
									key={metadata.idMas}
									storeCollapseState={storeCollapseState}
									metadataStructure={metadata}
									baseUrl={baseUrl}
									disableSectionAnchor={disableSectionAnchor}
								/>
							))}
						</ul>
					</nav>
				</section>

				{status === STATUS.CONTENT && (
					<button
						className="ouverture-sommaire"
						onClick={() => this.changeStatus(STATUS.BOTH)}
					>
						{D.helpSummary}
						<span className="glyphicon glyphicon-chevron-right" />
					</button>
				)}
				{status === STATUS.BOTH && (
					<div className="fermeture">
						<div className="fermeture-gauche">
							<button
								onClick={() => this.changeStatus(STATUS.CONTENT)}
								title="open summary"
							>
								<span className="glyphicon glyphicon-chevron-left" />
							</button>
						</div>
						<div className="fermeture-droite">
							<button
								onClick={() => this.changeStatus(STATUS.SUMMARY)}
								title="open content"
							>
								<span className="glyphicon glyphicon-chevron-right" />
							</button>
						</div>
					</div>
				)}
				{status === STATUS.SUMMARY && (
					<button
						className="ouverture-contenu"
						onClick={() => this.changeStatus(STATUS.BOTH)}
					>
						<span className="glyphicon glyphicon-chevron-left" />
						{D.helpContent}
					</button>
				)}
				<section
					style={styleContent}
					className={
						status === STATUS.CONTENT
							? 'sommaire-droite alone'
							: 'sommaire-droite'
					}
				>
					{children}
				</section>
			</div>
		);
	}
}

export default MSDComponent;
