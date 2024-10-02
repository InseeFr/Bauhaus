import { useState } from 'react';
import D from '../../../deprecated-locales';
import { CLOSE_MATCH } from '../../../sdk/constants';
import './equivalentLinks.scss';
import { TextInput } from '../../../components';
export const EquivalentLinks = ({ links = [], updateEquivalentLinks }) => {
	const [value, setValue] = useState('');
	return (
		<div className="equivalentLinks">
			<div className="row">
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
			</div>
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
