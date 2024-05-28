import React, { useState } from 'react';
import Modal from 'js/applications/shared/input-multi-modal-rmes/input-multi-modal-rmes';
import D, { D1, D2 } from 'js/i18n';

const InputMultiRmes = ({
	inputLg1,
	inputLg2,
	handleChangeLg1,
	handleChangeLg2,
	label,
}) => {
	const [arrayLg1, setArrayLg1] = useState(
		inputLg1.length === 0 ? [''] : inputLg1
	);
	const [arrayLg2, setArrayLg2] = useState(
		inputLg2.length === 0 ? [''] : inputLg2
	);
	const [modalAdd, setModalAdd] = useState(false);
	const [modalDelete, setModalDelete] = useState(false);
	const [modalLast, setModalLast] = useState(false);

	const close = () => {
		setModalAdd(false);
		setModalDelete(false);
		setModalLast(false);
	};

	const update = (lang, type) => {
		const array = lang === 'Lg1' ? arrayLg1 : arrayLg2;
		const arrayLength = array.length;

		if (array[arrayLength - 1] === '' && type === 'plus') {
			setModalAdd(true);
			return;
		} else if (array[arrayLength - 1] !== '' && type === 'minus') {
			setModalDelete(true);
			return;
		} else if (type === 'minus' && arrayLength === 1) {
			setModalLast(true);
			return;
		}

		if (type === 'plus') {
			lang === 'Lg1'
				? setArrayLg1(array.concat(['']))
				: setArrayLg2(array.concat(['']));
		} else if (type === 'minus' && arrayLength > 1) {
			array.pop();
			lang === 'Lg1' ? setArrayLg1(array) : setArrayLg2(array);
		}
	};

	const handleChange = (value, arrayName, i) => {
		const newArray = (arrayName === 'arrayLg1' ? arrayLg1 : arrayLg2).map(
			(e, j) => {
				if (j === i) return value;
				return e;
			}
		);

		arrayName === 'arrayLg1' ? setArrayLg1(newArray) : setArrayLg2(newArray);

		if (arrayName === 'arrayLg1') {
			handleChangeLg1(newArray);
			handleChangeLg2(arrayLg2);
		} else {
			handleChangeLg1(arrayLg1);
			handleChangeLg2(newArray);
		}
	};

	const initInput = (array, arrayName) => {
		return array.map((alt, i) => (
			<input
				key={i}
				type="text"
				value={alt}
				className="form-control form-group"
				onChange={(e) => handleChange(e.target.value, arrayName, i)}
			/>
		));
	};

	const altLg1 = initInput(arrayLg1, 'arrayLg1');
	const altLg2 = initInput(arrayLg2, 'arrayLg2');

	const button = (lang, type) => (
		<span
			className={`glyphicon glyphicon-${type}`}
			onClick={() => update(`${lang}`, `${type}`)}
		/>
	);

	return (
		<div className="row">
			<div className={`form-group col-md-6`}>
				<label>
					{D1[label]} {button('Lg1', 'minus')} {button('Lg1', 'plus')}
				</label>
				{altLg1}
			</div>
			<div className={`form-group col-md-6`}>
				<label>
					{D2[label]} {button('Lg2', 'minus')} {button('Lg2', 'plus')}
				</label>
				{altLg2}
			</div>
			{modalAdd && <Modal body={D.multiModalNoNewBody} close={close} />}
			{modalDelete && (
				<Modal body={D.multiModalRemoveCompleteBody} close={close} />
			)}
			{modalLast && <Modal body={D.multiModalRemoveLastBody} close={close} />}
		</div>
	);
};

export default InputMultiRmes;
