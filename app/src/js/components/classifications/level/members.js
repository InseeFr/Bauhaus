import React from 'react';
import Panel from 'js/components/shared/panel';
import SearchRmes from 'js/components/shared/search-rmes';
import D, { D2 } from 'js/i18n';

export default ({ members, classificationId, secondLang }) => {
	const membersLg1 = members.map(({ id, labelLg1 }, i) => ({
		id,
		label: `${id} - ${labelLg1}`,
	}));
	let membersLg2 = [];
	if (secondLang && members[0].labelLg2 !== undefined) {
		membersLg2 = members.map(({ id, labelLg2 }, i) => ({
			id,
			label: `${id} - ${labelLg2}`,
		}));
	}
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
			{secondLang && membersLg2.length !== 0 && (
				<div className="col-md-6">
					<Panel
						title={D2.childrenClassificationItems}
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
