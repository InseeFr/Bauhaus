import React from 'react';
import D from 'js/i18n';
import { rangeType } from 'js/utils/msd/';
const { CODE_LIST } = rangeType;

export default function HelpInformation({ msd, codesLists }) {
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
				{msd.rangeType === CODE_LIST && codesLists[msd.codeList]
					? `${D[`help${msd.rangeType}`]} - ${
							codesLists[msd.codeList].codeListLabelLg1
					  }`
					: `${D[`help${msd.rangeType}`]}`}

				{msd.rangeType === CODE_LIST &&
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
