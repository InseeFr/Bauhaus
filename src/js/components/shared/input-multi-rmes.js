import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Modal from './input-multi-modal-rmes';
import flagFr from 'js/components/shared/flag-fr';
import flagEn from 'js/components/shared/flag-en';

class InputMultiRmes extends Component {
	constructor(props) {
		super(props);
		const { arrayLg1, arrayLg2 } = this.props;

		this.state = {
			arrayLg1: arrayLg1,
			arrayLg2: arrayLg2,
			modalAdd: false,
			modalDelete: false,
			modalLast: false,
		};

		this.close = () => {
			this.setState({
				modalAdd: false,
				modalDelete: false,
				modalLast: false,
			});
		};

		this.update = (lang, type) => {
			const { arrayLg1, arrayLg2 } = this.state;
			const arrayName = `array${lang}`;
			const array = this.state[arrayName];
			const arrayLength = array.length;
			if (array[arrayLength - 1] === '' && type === 'plus')
				this.setState({
					modalAdd: true,
				});
			else if (array[arrayLength - 1] !== '' && type === 'minus')
				this.setState({
					modalDelete: true,
				});
			else if (type === 'plus')
				this.setState({
					[arrayName]: array.concat(['']),
				});
			else if (type === 'minus' && arrayLength > 1) {
				array.pop();
				this.setState({
					[arrayName]: array,
				});
			} else if (type === 'minus' && arrayLength === 1) {
				this.setState({
					modalLast: true,
				});
			}
		};

		this.initInput = (array, arrayName) => {
			return array.map((alt, i) =>
				<input
					key={i}
					type="text"
					value={alt}
					className="form-control form-group"
					onChange={e => this.handleChange(e.target.value, arrayName, i)}
				/>
			);
		};

		this.handleChange = (value, arrayName, i) => {
			const newArray = this.state[arrayName].map((e, j) => {
				if (j === i) return value;
				return e;
			});
			this.setState({
				[arrayName]: newArray,
			});
			const { handleChangeLg1, handleChangeLg2 } = this.props;
			const { arrayLg1, arrayLg2 } = this.state;
			if (arrayName === 'arrayLg1') {
				handleChangeLg1(newArray.join('||'));
				handleChangeLg2(arrayLg2.join('||'));
			} else {
				handleChangeLg1(arrayLg1.join('||'));
				handleChangeLg2(newArray.join('||'));
			}
		};
	}
	render() {
		const { label } = this.props;
		const { arrayLg1, arrayLg2, modalAdd, modalDelete, modalLast } = this.state;

		const altLg1 = this.initInput(arrayLg1, 'arrayLg1');
		const altLg2 = this.initInput(arrayLg2, 'arrayLg2');

		const button = (lang, type) =>
			<span
				className={`glyphicon glyphicon-${type}`}
				onClick={() => this.update(`${lang}`, `${type}`)}
			/>;

		return (
			<div className="row">
				<div className={`form-group col-md-6`}>
					<label>
						{label} ( {flagFr} ) {button('Lg1', 'minus')}{' '}
						{button('Lg1', 'plus')}
					</label>
					{altLg1}
				</div>
				<div className={`form-group col-md-6`}>
					<label>
						{label} ( {flagEn} ) {button('Lg2', 'minus')}{' '}
						{button('Lg2', 'plus')}
					</label>
					{altLg2}
				</div>
				{modalAdd &&
					<Modal
						body="Remplissez le champ précédent pour en ajouter un nouveau"
						close={this.close}
					/>}
				{modalDelete &&
					<Modal
						body="Impossible de supprimer un champ rempli"
						close={this.close}
					/>}
				{modalLast &&
					<Modal
						body="Impossible de supprimer le dernier champ"
						close={this.close}
					/>}
			</div>
		);
	}
}

InputMultiRmes.propTypes = {
	arrayLg1: PropTypes.array.isRequired,
	arrayLg2: PropTypes.array.isRequired,
	label: PropTypes.string.isRequired,
	handleChangeLg1: PropTypes.func.isRequired,
	handleChangeLg2: PropTypes.func.isRequired,
};

export default InputMultiRmes;
