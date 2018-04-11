import React from 'react';
import Panel from 'js/components/shared/panel';
import SearchRmes from 'js/components/shared/search-rmes';
import D from 'js/i18n';

export default ({ members, classificationId, secondLang }) => {
	const membersLg1 = members.map(({ id, labelLg1 }, i) => ({
		id,
		label: `${id} - ${labelLg1}`,
	}));
	let membersLg2 = [];
	if (secondLang)
		membersLg2 = members.map(({ id, labelLg2 }, i) => ({
			id,
			label: `${id} - ${labelLg2}`,
		}));
	const isMembersLg2 = membersLg2.filter(m => m !== null).length !== 0;
	return (
		<div className="row">
			<div className={`col-md-${secondLang ? 6 : 12}`}>
				<Panel title={D.childrenClassificationItems} context="classifications">
					<div className="centered">
						<SearchRmes
							items={membersLg1}
							childPath={`classifications/classification/${classificationId}/item`}
							context="classifications"
							col={secondLang ? 12 : 8}
							colOff={secondLang ? 0 : 2}
						/>
					</div>
				</Panel>
			</div>
			{secondLang &&
				isMembersLg2 && (
					<div className="col-md-6">
						<Panel
							title={D.childrenClassificationItems}
							context="classifications"
						>
							<div className="centered">
								<SearchRmes
									items={membersLg2}
									childPath={`classifications/classification/${classificationId}/item`}
									context="classifications"
									col={12}
									colOff={0}
								/>
							</div>
						</Panel>
					</div>
				)}
		</div>
	);
};
