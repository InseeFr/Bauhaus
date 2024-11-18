import { useState } from 'react';
import D from '../../../deprecated-locales';
import { CLOSE_MATCH } from '../../../sdk/constants';
import './equivalentLinks.scss';
import { Link } from '../../../model/concepts/concept';
import { Row } from '@components/layout';
import { TextInput } from '@components/form/input';

type EquivalentLinksTypes = {
	links: (Link & { urn: string })[];
	updateEquivalentLinks: (links: (Link | { urn: string })[]) => void;
};

export const EquivalentLinks = ({
	links = [],
	updateEquivalentLinks,
}: Readonly<EquivalentLinksTypes>) => {
	const [value, setValue] = useState('');
	return (
		<div className="equivalentLinks">
			<Row>
				<div className="col-md-12">
					<div className="form-group">
						<TextInput
							placeholder={D.btnNewLink}
							aria-label={D.btnNewLink}
							value={value}
							onChange={(e) => setValue(e.target.value)}
						/>
					</div>
					<button
						onClick={() => {
							updateEquivalentLinks([
								...links,
								{
									urn: value,
									prefLabelLg1: value,
									prefLabelLg2: value,
									typeOfLink: CLOSE_MATCH,
								},
							]);
							setValue('');
						}}
					>
						{D.btnAdd}
					</button>
				</div>
			</Row>
			<ul>
				{links.map((link) => {
					return (
						<li key={link.urn} className="list-group-item">
							<span>{link.urn}</span>
							<button
								aria-label={D.btnDelete}
								onClick={() => {
									updateEquivalentLinks(
										links.filter(({ urn }) => urn !== link.urn),
									);
								}}
							>
								<span
									className="glyphicon glyphicon-trash"
									aria-hidden="true"
								/>
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
