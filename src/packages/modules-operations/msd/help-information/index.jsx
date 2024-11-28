import D from '../../../deprecated-locales';
import { rangeType } from '../../../modules-operations/utils/msd';

const { CODE_LIST, ORGANIZATION } = rangeType;

export default function HelpInformation({ msd, codesLists, organisations }) {
	if (!msd.masLabelLg1) {
		return null;
	}
	return (
		<dl>
			<dt>{D.labelTitle}:</dt>
			<dd>{msd.masLabelLg2}</dd>
			<dt>{D.helpPresentational}:</dt>
			<dd>{msd.isPresentational.toString()}</dd>
			{msd.maxOccurs && (
				<>
					<dt>{D.helpMaxOccurs}:</dt>
					<dd>{msd.maxOccurs}</dd>
				</>
			)}
			<dt>{D.helpRange}:</dt>
			<dd>
				{msd.rangeType === CODE_LIST && codesLists[msd.codeList]
					? `${D[`help${msd.rangeType}`]} - ${
							codesLists[msd.codeList].codeListLabelLg1
						}`
					: `${D[`help${msd.rangeType}`]}`}

				{msd.rangeType === CODE_LIST && codesLists[msd.codeList] && (
					<ul className="list-group">
						{codesLists[msd.codeList]?.codes.map((code) => (
							<li className="list-group-item" key={code.code}>
								{code.labelLg1}
							</li>
						))}
					</ul>
				)}
				{msd.rangeType === ORGANIZATION && (
					<ul className="list-group">
						{organisations.map((orga) => (
							<li className="list-group-item" key={orga.id}>
								{orga.label}
							</li>
						))}
					</ul>
				)}
			</dd>
		</dl>
	);
}
