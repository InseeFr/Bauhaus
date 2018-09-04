import React, { Component } from 'react';
import SummaryItem from 'js/components/operations/msd/msd/item';
import D from 'js/i18n';

import './style.css';

const STATUS = {
	BOTH: 'BOTH',
	SUMMARY: 'SUMMARY',
	CONTENT: 'CONTENT',
};
class MSDComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			status: localStorage.getItem('HELP_VIEW') || STATUS.BOTH,
		};
	}

	changeStatus(status) {
		localStorage.setItem('HELP_VIEW', status);
		this.setState({
			status,
		});
	}
	render() {
		const { status } = this.state;
		const { codesLists } = this.props;
		function displayInformation(msd) {
			if (!msd.masLabelLg1) {
				return null;
			}
			return (
				<dl>
					<dt>{D.labelTitle}:</dt>
					<dd>{msd.masLabelLg2}</dd>
					<dt>{D.helpPresentational}:</dt>
					<dd>{msd.isPresentational.toString()}</dd>
					<dt>{D.helpRange}:</dt>
					<dd>
						{msd.rangeType === 'CODE_LIST' && codesLists[msd.codeList]
							? `${D[`help${msd.rangeType}`]} - ${
									codesLists[msd.codeList].codeListLabelLg1
								}`
							: `${D[`help${msd.rangeType}`]}`}

						{msd.rangeType === 'CODE_LIST' &&
							codesLists[msd.codeList] && (
								<ul className="list-group">
									{codesLists[msd.codeList].codes.map(code => (
										<li className="list-group-item" key={code.code}>
											{code.labelLg1}
										</li>
									))}
								</ul>
							)}
					</dd>
				</dl>
			);
		}

		function displayContent(children) {
			if (Object.keys(children).length <= 0) return null;
			return (
				<div>
					{Object.keys(children).map(id => {
						return (
							<div key={id} className="contenu">
								<article id={id} className="panel panel-default">
									<div className="panel-heading">
										<h3>{`${id} - ${children[id].masLabelLg1}`}</h3>
									</div>
									<div className="panel-body">
										{displayInformation(children[id])}
									</div>
								</article>
								{displayContent(children[id].children)}
							</div>
						);
					})}
				</div>
			);
		}

		const styleSummary = {
			width: status === STATUS.BOTH ? '33%' : '100%',
			display: status === STATUS.CONTENT ? 'none' : 'block',
		};
		const styleContent = {
			width: status === STATUS.BOTH ? '66%' : '100%',
			display: status === STATUS.SUMMARY ? 'none' : 'block',
		};
		return (
			<div
				id="consulter-sommaire"
				className="container panneau produit-sommaire"
			>
				<section className="sommaire-gauche" style={styleSummary}>
					<div className="titre-sommaire titre">{D.helpSummary}</div>
					<input className="form-control" disabled placeholder={D.search} />
					<nav className="sommaire-container">
						<ul className="sommaire">
							{Object.keys(this.props.metadataStructure).map(id => (
								<SummaryItem
									key={id}
									metadataStructure={this.props.metadataStructure[id]}
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
					{Object.keys(this.props.metadataStructure).map(id => {
						if (this.props.currentSection && id !== this.props.currentSection) {
							return null;
						}
						return (
							<div key={id}>
								<div className="panel panel-default">
									<div className="panel-heading">
										<h2 id={id} className="titre-principal">
											{id} - {this.props.metadataStructure[id].masLabelLg1}
										</h2>
									</div>
									<div className="panel-body">
										{displayInformation(this.props.metadataStructure[id])}
									</div>
								</div>
								{displayContent(this.props.metadataStructure[id].children)}
							</div>
						);
					})}
				</section>
			</div>
		);
	}
}

export default MSDComponent;
