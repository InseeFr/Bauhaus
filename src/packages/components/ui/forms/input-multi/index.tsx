import { Chips } from 'primereact/chips';

import { Row } from '@components/layout';

import { D1, D2 } from '../../../../deprecated-locales';
import './input-multi.css';

interface InputMultiTypes {
	inputLg1: string[];
	inputLg2?: string[];
	label: string;
	handleChangeLg1: (value: string[]) => void;
	handleChangeLg2?: (value: string[]) => void;
	type?: 'text' | 'url';
}

export const InputMulti = ({
	inputLg1,
	inputLg2,
	label,
	handleChangeLg2,
	handleChangeLg1,
}: Readonly<InputMultiTypes>) => {
	return (
		<Row className="input-multi">
			<div className={`form-group col-md-${handleChangeLg2 ? 6 : 12}`}>
				<label>
					{D1[label] ?? label}
					<Chips
						value={inputLg1}
						onChange={(e) => handleChangeLg1(e.value ?? [])}
						placeholder="Tapez une valeur et appuyez sur Entrée"
						separator=","
						allowDuplicate={false}
						addOnBlur={true}
						aria-label={`${D1[label] ?? label} - Appuyez sur Entrée ou virgule pour ajouter`}
					/>
					<small className="form-text text-muted">
						Appuyez sur Entrée ou virgule pour ajouter une valeur
					</small>
				</label>
			</div>
			{!!handleChangeLg2 && (
				<div className="form-group col-md-6">
					<label>
						{D2[label] ?? label}

						<Chips
							value={inputLg2}
							onChange={(e) => handleChangeLg2(e.value ?? [])}
							placeholder="Tapez une valeur et appuyez sur Entrée"
							separator=","
							allowDuplicate={false}
							addOnBlur={true}
							aria-label={`${D2[label] ?? label} - Appuyez sur Entrée ou virgule pour ajouter`}
						/>
						<small className="form-text text-muted">
							Appuyez sur Entrée ou virgule pour ajouter une valeur
						</small>
					</label>
				</div>
			)}
		</Row>
	);
};
